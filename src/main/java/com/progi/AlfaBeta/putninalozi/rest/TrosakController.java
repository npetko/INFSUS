package com.progi.AlfaBeta.putninalozi.rest;

import com.progi.AlfaBeta.putninalozi.domain.Obracun;
import com.progi.AlfaBeta.putninalozi.domain.Trosak;
import com.progi.AlfaBeta.putninalozi.service.ObracunService;
import com.progi.AlfaBeta.putninalozi.service.TrosakService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.json.JsonParser;
import org.springframework.boot.json.JsonParserFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import com.progi.AlfaBeta.putninalozi.rest.ObracunController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/trosak")
public class TrosakController {

    @Autowired
    private TrosakService trosakService;

    @Autowired
    private ObracunService obracunService;

    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @GetMapping(value = "/troskoviObracuna/{brPutnogNaloga}", produces = "application/json")
    public ResponseEntity<?> troskoviObracuna (@PathVariable("brPutnogNaloga") String brPutnogNaloga){


        List<Trosak> troskovi = trosakService.getTroskovi(brPutnogNaloga);

        if(troskovi.size() == 0){
            return new ResponseEntity<>("Nema troskova za prikaz", HttpStatus.ACCEPTED);
        } else {
            List<String> troskoviZaVratit = new ArrayList<>();

            for(Trosak t : troskovi){
                troskoviZaVratit.add("{\"brPutnogNaloga\":\"" + t.getBrPutnogNaloga() +
                        "\",\"opis\":\"" + t.getOpis() +"\",\"idTrosak\":\"" + t.getIdTrosak() +
                        "\",\"iznos\":\"" + t.getIznosValuta() + " " + t.getValuta() +
                        "\",\"refund\":\"" + t.getRefund() + "\"}");
            }

            StringBuilder builder = new StringBuilder();
            builder.append("{\"troskovi\":");
            builder.append(troskoviZaVratit);
            builder.append("}");

            return new ResponseEntity<>(builder.toString(), HttpStatus.OK);

        }

    }

    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @PostMapping(value = "/noviTrosak", consumes = "application/json")
    public ResponseEntity<?> noviTrosak(@RequestBody String trosakData){
        JsonParser parser = JsonParserFactory.getJsonParser();
        Map<String, Object> trosakMap = parser.parseMap(trosakData);

        Trosak trosak = new Trosak();

        try{
            trosak.setBrPutnogNaloga(trosakMap.get("brPutnogNaloga").toString());
        } catch (Exception e){
            return new ResponseEntity("Greška u unosu broja putnog naloga.", HttpStatus.ACCEPTED);
        }

        try{
            trosak.setOpis(trosakMap.get("opis").toString());
        } catch (Exception e){
            return new ResponseEntity("Greška u opisa.", HttpStatus.ACCEPTED);
        }

        try{
            trosak.setIznosValuta(Double.parseDouble(trosakMap.get("iznosTroska").toString()));
        } catch (Exception e){
            return new ResponseEntity("Greška u unosu iznosa", HttpStatus.ACCEPTED);
        }

        try{
            trosak.setValuta(trosakMap.get("valuta").toString());
        } catch (Exception e){
            return new ResponseEntity<>("Greška u unosu valuta", HttpStatus.ACCEPTED);
        }

        try{
            trosak.setRefund(Boolean.parseBoolean(trosakMap.get("refund").toString()));
        } catch (Exception e){
            return new ResponseEntity("Greška u unosu refunda.", HttpStatus.ACCEPTED);
        }

        trosakService.addTrosak(trosak);

        return new ResponseEntity(trosak.getIdTrosak(), HttpStatus.OK);

    }

    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @GetMapping(value = "/popisValuta", produces = "application/json")
    public ResponseEntity<?> popisValuta(){
        String url = "https://api.hnb.hr/tecajn-eur/v3";

        RestTemplate restTemplate = new RestTemplate();

        Object[] popisValuta = restTemplate.getForObject(url, Object[].class);

        return new ResponseEntity<>(popisValuta, HttpStatus.ACCEPTED);
    }

}
