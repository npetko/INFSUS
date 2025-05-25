package com.progi.AlfaBeta.putninalozi.service.impl;

import com.progi.AlfaBeta.putninalozi.dao.ObracunRepository;
import com.progi.AlfaBeta.putninalozi.domain.*;
import com.progi.AlfaBeta.putninalozi.dto.ObracunDto;
import com.progi.AlfaBeta.putninalozi.service.DrzavaService;
import com.progi.AlfaBeta.putninalozi.service.ObracunService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.json.JsonParser;
import org.springframework.boot.json.JsonParserFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.text.DecimalFormat;
import java.time.Duration;
import java.util.List;
import java.util.Map;

@Service
public class ObracunServiceImpl implements ObracunService {

    @Autowired
    private ObracunRepository obracunRepo;

    @Autowired
    private DrzavaService drzavaService;

    public ObracunServiceImpl(ObracunRepository obracunRepository){
        this.obracunRepo = obracunRepository;
    }

    @Override
    public Obracun addObracun(Obracun obracun){
        obracun.setStatusObracuna(StatusObracun.SPREMAN_ZA_OBRACUN);
        obracunRepo.saveAndFlush(obracun);
        return obracun;
    }

    @Override
    public Obracun findByBr(String brnalog){return obracunRepo.findByBrPutnogNaloga(brnalog);}

    @Override
    public Obracun saveObracun(Obracun obracun) {
        obracunRepo.saveAndFlush(obracun);
        return obracun;
    }

    @Override
    public List<Obracun> listAll() {
        return obracunRepo.findAll();
    }

    @Override
    public Obracun deleteObracun(Obracun obracun) {
        obracunRepo.delete(obracun);
        return obracun;
    }

    @Override
    public ObracunDto obracunajNalog(Obracun obracun, Zahtjev zahtjev, List<Trosak> troskovi, List<BoravakDrzava> boravci, Map<String, String> mapaBoravaka) {

        ObracunDto obracunDto = new ObracunDto();

        JsonParser parser = JsonParserFactory.getJsonParser();

        Double iznosTroskova = 0.0;

        if (troskovi.size() != 0) {
            for (Trosak t : troskovi) {
                if (t.getRefund() == true) {
                    if(!t.getValuta().equals("EUR")) {
                        StringBuilder builder = new StringBuilder();
                        builder.append("https://api.hnb.hr/tecajn-eur/v3?valuta=");
                        builder.append(t.getValuta());
                        String url = builder.toString();
                        RestTemplate restTemplate = new RestTemplate();
                        String valuta = restTemplate.getForObject(url, String.class);

                        String novaValuta = valuta.substring(1, valuta.length() - 1);
                        Map<String, Object> mapaValuta = parser.parseMap(novaValuta);
                        String tecaj = mapaValuta.get("srednji_tecaj").toString();
                        String noviTecaj = tecaj.replace(",", ".");

                        double iznosVal = (double) t.getIznosValuta() / Double.parseDouble(noviTecaj);

                        iznosTroskova += iznosVal;
                    } else {
                        iznosTroskova += t.getIznosValuta();
                    }

                }
            }
        }

        double sumBoravaka = 0;
        if (boravci.size() != 0) {
            for (BoravakDrzava b : boravci) {

                Duration dur = Duration.between(b.getVrijDolazak(), b.getVrijOdlazak());
                String duration = dur.toString();
                int i = 2;
                StringBuilder hours = new StringBuilder();

                while ((duration.charAt(i)) != 'H') {
                    hours.append(duration.charAt(i));
                    i++;
                }

                int hoursIn = Integer.parseInt(hours.toString());
                int days = hoursIn / 24;
                int hoursDay = hoursIn % 24;

                String dnevnica = mapaBoravaka.get(b.getImeDrzave());
                String dnevnicaSplit = dnevnica.substring(0, 4);
                String dnevnicaValuta = dnevnica.substring(5);

                if(dnevnicaValuta.equals("USD")) {
                    String url = "https://api.hnb.hr/tecajn-eur/v3?valuta=USD";

                    RestTemplate restTemplate = new RestTemplate();
                    String valuta = restTemplate.getForObject(url, String.class);

                    String novaValuta = valuta.substring(1, valuta.length() - 1);
                    Map<String, Object> mapaDnevnica = parser.parseMap(novaValuta);
                    String tecaj = mapaDnevnica.get("srednji_tecaj").toString();
                    String noviTecaj = tecaj.replace(",", ".");
                    double iznos = (double) Double.parseDouble(dnevnicaSplit) / Double.parseDouble(noviTecaj);
                    sumBoravaka += iznos * days;

                    if (hoursDay < 8 && hoursDay != 0 && hoursDay < 12) {
                        sumBoravaka += iznos / 2;
                    } else if (hoursDay != 0 && hoursDay >= 12) {
                        sumBoravaka += iznos;
                    }

                } else {
                    sumBoravaka += Double.parseDouble(dnevnicaSplit) * days;
                    if (hoursDay >= 8 && hoursDay != 0 && hoursDay < 12) {
                        sumBoravaka += Double.parseDouble(dnevnicaSplit) / 2;
                    } else if (hoursDay != 0 && hoursDay >= 12) {
                        sumBoravaka += Double.parseDouble(dnevnicaSplit);
                    }
                }


            }
        } else {

            Duration dur = Duration.between(zahtjev.getPocPutovanja(), zahtjev.getKrajPutovanja());
            String duration = dur.toString();
            int i = 2;
            StringBuilder hours = new StringBuilder();

            while ((duration.charAt(i)) != 'H') {
                hours.append(duration.charAt(i));
                i++;
            }
            System.out.println("Provede " + hours.toString());
            int hoursIn = Integer.parseInt(hours.toString());
            int days;
            if(hoursIn < 24) {
                days = 0;
            } else {
                days = hoursIn / 24;
            }
            int hoursDay = hoursIn % 24;

            String dnevnica = mapaBoravaka.get(zahtjev.getSifDrzava().toUpperCase());
            String dnevnicaSplit = dnevnica.substring(0, 4);
            String dnevnicaValuta = dnevnica.substring(5);

            if(dnevnicaValuta.equals("USD")) {
                String url = "https://api.hnb.hr/tecajn-eur/v3?valuta=USD";

                RestTemplate restTemplate = new RestTemplate();
                String valuta = restTemplate.getForObject(url, String.class);

                String novaValuta = valuta.substring(1, valuta.length() - 1);
                Map<String, Object> mapaDnevnica = parser.parseMap(novaValuta);
                String tecaj = mapaDnevnica.get("srednji_tecaj").toString();
                String noviTecaj = tecaj.replace(",", ".");
                double iznos = (double) Double.parseDouble(dnevnicaSplit) / Double.parseDouble(noviTecaj);
                sumBoravaka += iznos * days;

                if (hoursDay >= 8 && hoursDay != 0 && hoursDay < 12) {
                    sumBoravaka += iznos / 2;
                } else if (hoursDay != 0 && hoursDay >= 12) {
                    sumBoravaka += iznos;
                }

            } else {
                sumBoravaka += Double.parseDouble(dnevnicaSplit) * days;
                if (hoursDay >= 8 && hoursDay != 0 && hoursDay < 12) {
                    sumBoravaka += Double.parseDouble(dnevnicaSplit) / 2;
                } else if (hoursDay != 0 && hoursDay >= 12) {
                    sumBoravaka += Double.parseDouble(dnevnicaSplit);
                }
            }

        }

        double zbroj = iznosTroskova + sumBoravaka;
        if (!obracun.getRegAuto().equals("")) {
            zbroj += 0.5 * Double.parseDouble(obracun.getKilometri());
        }

        zbroj = zbroj - zahtjev.getAkontacija();

        //DecimalFormat df = new DecimalFormat();
        //df.setMaximumFractionDigits(2);

        //obracunDto.setDnevnice(Double.parseDouble(df.format(sumBoravaka)));
        //obracunDto.setTroskovi(Double.parseDouble(df.format(iznosTroskova)));
        //obracunDto.setIzracun(Double.parseDouble(df.format(zbroj)));

        obracunDto.setDnevnice(Math.round(sumBoravaka));
        obracunDto.setTroskovi(Math.round(iznosTroskova));
        obracunDto.setIzracun(Math.round(zbroj));

        return obracunDto;
    }


}
