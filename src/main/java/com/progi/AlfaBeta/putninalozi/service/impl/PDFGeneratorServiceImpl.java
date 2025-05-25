package com.progi.AlfaBeta.putninalozi.service.impl;


import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.Image;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.BaseFont;
import com.lowagie.text.pdf.PdfWriter;
import com.lowagie.text.pdf.TextField;
import com.progi.AlfaBeta.putninalozi.domain.*;
import com.progi.AlfaBeta.putninalozi.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletResponse;
import java.awt.*;
import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

@Service
public class PDFGeneratorServiceImpl implements PDFGeneratorService {

    @Autowired
    private FirmaService firmaService;

    @Autowired
    private TrosakService trosakService;

    @Autowired
    private BoravakDrzavaService boravakDrzavaService;

    @Autowired
    private FileStorageService fileStorageService;


    @Override
    public void exportZahtjev(Zahtjev zahtjev, HttpServletResponse response) throws IOException {
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, response.getOutputStream());


        document.open();
        Font fontTitle = FontFactory.getFont(FontFactory.HELVETICA_BOLD,BaseFont.CP1250, BaseFont.EMBEDDED, 0.8f, Font.NORMAL, Color.BLACK);
        fontTitle.setSize(18);


        java.awt.Image awtImage = Toolkit.getDefaultToolkit().createImage("frontend/react-frontend/public/alfaBetaLogo1.jpg");
        com.lowagie.text.Image img1 = com.lowagie.text.Image.getInstance(awtImage, Color.black);
        img1.scaleAbsolute(70,60);
        img1.setAlignment(Image.ALIGN_RIGHT);


        Font fontParagraph = FontFactory.getFont(FontFactory.TIMES,
                BaseFont.CP1250, BaseFont.EMBEDDED, 0.8f, Font.NORMAL, Color.BLACK);
        fontParagraph.setSize(12);


        Font fontHeader = FontFactory.getFont(FontFactory.TIMES_ITALIC,BaseFont.CP1250, BaseFont.EMBEDDED, 0.8f, Font.NORMAL, Color.BLACK);
        fontHeader.setSize(11);


        Firma firma = firmaService.listAll().get(0);

        Paragraph firma2 = new Paragraph(firma.getAdresa(),fontHeader);

        Paragraph firma3 = new Paragraph(firma.getOib(),fontHeader);

        Paragraph firma4 = new Paragraph(firma.getEmail(),fontHeader);

        Paragraph paragraphFirma = new Paragraph(firma.getIme(),fontHeader);
        paragraphFirma.add("\n");
        paragraphFirma.add(firma2);
        paragraphFirma.add(firma3);
        paragraphFirma.add(firma4);


        Table tablica = new Table(2,1);
        Cell cell = new Cell(paragraphFirma);
        cell.setBorder(Rectangle.NO_BORDER);
        tablica.addCell(cell,0,0);
        cell = new Cell(img1);
        cell.setBorder(Rectangle.NO_BORDER);
        tablica.addCell(cell,0,1);
        tablica.setBorderColor(Color.WHITE);
        tablica.setTableFitsPage(true);
        document.add(tablica);


        Paragraph paragraph = new Paragraph("Zahtjev br." + zahtjev.getBrPutnogNaloga(),fontTitle);
        paragraph.setAlignment(Paragraph.ALIGN_CENTER);



        Paragraph paragraph2 = new Paragraph("Korisničko ime:     " + zahtjev.getKorisnickoIme(),fontParagraph);
        paragraph2.setAlignment(Paragraph.ALIGN_LEFT);


        Paragraph paragraph3 = new Paragraph("Početak putovanja:     " + zahtjev.getPocPutovanja().toString(),fontParagraph);
        paragraph2.setAlignment(Paragraph.ALIGN_LEFT);

        Paragraph paragraph4 = new Paragraph("Kraj putovanja:     " + zahtjev.getKrajPutovanja().toString(),fontParagraph);
        paragraph2.setAlignment(Paragraph.ALIGN_LEFT);

        Paragraph paragraph5 = new Paragraph("Mjesto:     " + zahtjev.getMjesto(),fontParagraph);
        paragraph2.setAlignment(Paragraph.ALIGN_LEFT);

        Paragraph paragraph10 = new Paragraph("Država putovanja:     " + zahtjev.getSifDrzava(),fontParagraph);
        paragraph2.setAlignment(Paragraph.ALIGN_LEFT);

        Paragraph paragraph6 = new Paragraph("Razlog:     " + zahtjev.getRazlog(),fontParagraph);
        paragraph2.setAlignment(Paragraph.ALIGN_LEFT);

        Paragraph paragraph7 = new Paragraph("Prijevozno sredstvo:     " + zahtjev.getPrijevoznoSredstvo(),fontParagraph);
        paragraph2.setAlignment(Paragraph.ALIGN_LEFT);

        Paragraph paragraph8 = new Paragraph("Mjesto troška:     " + zahtjev.getMjestoTroska(),fontParagraph);
        paragraph2.setAlignment(Paragraph.ALIGN_LEFT);

        Paragraph paragraph9 = new Paragraph("Akontacija:     " + zahtjev.getAkontacija(),fontParagraph);
        paragraph2.setAlignment(Paragraph.ALIGN_LEFT);

        Paragraph paragraph11 = new Paragraph("Status:     " + zahtjev.getStatus().toString(),fontParagraph);
        paragraph2.setAlignment(Paragraph.ALIGN_LEFT);




        document.add(paragraph);
        document.add(new Paragraph("\n"));
        document.add(paragraph2);
        document.add(new Paragraph("\n"));
        document.add(paragraph3);
        document.add(new Paragraph("\n"));
        document.add(paragraph4);
        document.add(new Paragraph("\n"));
        document.add(paragraph5);
        document.add(new Paragraph("\n"));
        document.add(paragraph10);
        document.add(new Paragraph("\n"));
        document.add(paragraph6);
        document.add(new Paragraph("\n"));
        document.add(paragraph7);
        document.add(new Paragraph("\n"));
        document.add(paragraph8);
        document.add(new Paragraph("\n"));
        document.add(paragraph9);
        document.add(new Paragraph("\n"));
        document.add(paragraph11);
        document.add(new Paragraph("\n"));
        if(zahtjev.getRazlogVracanja()!=null)
        {
            if(zahtjev.getStatus().toString()=="STORNIRAN"){
                Paragraph paragraph12 = new Paragraph("Razlog storniranja:     " + zahtjev.getRazlogVracanja(),fontParagraph);
                paragraph12.setAlignment(Paragraph.ALIGN_LEFT);
                document.add(paragraph12);
            }
            else {
                Paragraph paragraph12 = new Paragraph("Razlog vraćanja:     " + zahtjev.getRazlogVracanja(), fontParagraph);
                paragraph12.setAlignment(Paragraph.ALIGN_LEFT);
                document.add(paragraph12);
            }
        }

        document.close();


    }

    @Override
    public void exportObracun(Obracun obracun, HttpServletResponse response) throws IOException {
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, response.getOutputStream());

        document.open();
        Font fontTitle = FontFactory.getFont(FontFactory.HELVETICA_BOLD,BaseFont.CP1250, BaseFont.EMBEDDED, 0.8f, Font.NORMAL, Color.BLACK);
        fontTitle.setSize(18);

        //ubaci maticne podatke o tvrtki

        java.awt.Image awtImage = Toolkit.getDefaultToolkit().createImage("frontend/react-frontend/public/alfaBetaLogo1.jpg");
        com.lowagie.text.Image img1 = com.lowagie.text.Image.getInstance(awtImage, Color.black);
        img1.scaleAbsolute(70,60);
        img1.setAlignment(Image.ALIGN_RIGHT);
        //document.add(img1);

        Font fontParagraph = FontFactory.getFont(FontFactory.TIMES,
                BaseFont.CP1250, BaseFont.EMBEDDED, 0.8f, Font.NORMAL, Color.BLACK);
        fontParagraph.setSize(12);

        Font fontHeader = FontFactory.getFont(FontFactory.TIMES_ITALIC,BaseFont.CP1250, BaseFont.EMBEDDED, 0.8f, Font.NORMAL, Color.BLACK);
        fontHeader.setSize(11);


        Firma firma = firmaService.listAll().get(0);

        Paragraph firma2 = new Paragraph(firma.getAdresa(),fontHeader);

        Paragraph firma3 = new Paragraph(firma.getOib(),fontHeader);

        Paragraph firma4 = new Paragraph(firma.getEmail(),fontHeader);

        Paragraph paragraphFirma = new Paragraph(firma.getIme(),fontHeader);
        paragraphFirma.add("\n");
        paragraphFirma.add(firma2);
        paragraphFirma.add(firma3);
        paragraphFirma.add(firma4);


        Table tablica = new Table(2,1);
        Cell cell = new Cell(paragraphFirma);
        cell.setBorder(Rectangle.NO_BORDER);
        tablica.addCell(cell,0,0);
        cell = new Cell(img1);
        cell.setBorder(Rectangle.NO_BORDER);
        tablica.addCell(cell,0,1);
        tablica.setBorderColor(Color.WHITE);
        tablica.setTableFitsPage(true);
        document.add(tablica);

        Paragraph paragraph = new Paragraph("Obračun br. " + obracun.getBrPutnogNaloga(),fontTitle);
        paragraph.setAlignment(Paragraph.ALIGN_CENTER);

        Paragraph paragraph1 = new Paragraph("Opis:     " + obracun.getOpis(),fontParagraph);
        paragraph1.setAlignment(Paragraph.ALIGN_LEFT);

        Paragraph paragraph2 = new Paragraph("Vrijeme polaska:     " + obracun.getVrijPolazak(),fontParagraph);
        paragraph1.setAlignment(Paragraph.ALIGN_LEFT);

        Paragraph paragraph3 = new Paragraph("Vrijeme dolaska:     " + obracun.getVrijDolazak(),fontParagraph);
        paragraph1.setAlignment(Paragraph.ALIGN_LEFT);

        Paragraph paragraph4 = new Paragraph("Status:     " + obracun.getStatusObracuna(),fontParagraph);
        paragraph1.setAlignment(Paragraph.ALIGN_LEFT);

        Paragraph paragraph5 = new Paragraph("Izračun:     " + obracun.getIzracun(),fontParagraph);
        paragraph1.setAlignment(Paragraph.ALIGN_LEFT);

        Paragraph paragraph6 = new Paragraph("Prijeđeni kilometri:     " + obracun.getKilometri(),fontParagraph);
        paragraph1.setAlignment(Paragraph.ALIGN_LEFT);

        document.add(paragraph);
        document.add(paragraph1);
        document.add(paragraph2);
        document.add(paragraph3);
        document.add(paragraph4);
        document.add(paragraph5);
        document.add(paragraph6);

        if(obracun.getRegAuto()!=null)
        {
            Paragraph paragraph12 = new Paragraph("Registracija auta:     " + obracun.getRegAuto(),fontParagraph);
            paragraph12.setAlignment(Paragraph.ALIGN_LEFT);
            document.add(paragraph12);
        }

        if(obracun.getRazlogStorn()!=null)
        {
            Paragraph paragraph13 = new Paragraph("Razlog storniranja:     " + obracun.getRazlogStorn(),fontParagraph);
            paragraph13.setAlignment(Paragraph.ALIGN_LEFT);
            document.add(paragraph13);
        }

        List<Trosak> troskovi= new ArrayList<Trosak>();
        troskovi = trosakService.getTroskovi(obracun.getBrPutnogNaloga());

        Paragraph paragraphT1 = new Paragraph("Troškovi",fontTitle);
        paragraph.setAlignment(Paragraph.ALIGN_CENTER);
        document.add(paragraphT1);

        if(troskovi.size()==0){
            Paragraph p = new Paragraph("Nema troškova za prikaz.",fontParagraph);
            document.add(p);
        }

        for(Trosak trosak : troskovi){
            FileDB file = fileStorageService.getFile(trosak.getIdTrosak());

            awtImage = Toolkit.getDefaultToolkit().createImage(file.getData());
            img1 = com.lowagie.text.Image.getInstance(awtImage, null);
            //img1.scaleAbsolute(300,300);
            img1.setAlignment(Image.ALIGN_RIGHT);

            Paragraph t = new Paragraph(trosak.toString());
            Table tab = new Table(2,1);
            cell = new Cell(t);
            cell.setBorder(Rectangle.NO_BORDER);
            tab.addCell(cell,0,0);
            cell = new Cell(img1);
            cell.setBorder(Rectangle.NO_BORDER);
            tab.addCell(cell,0,1);
            tab.setBorderColor(Color.WHITE);
            tab.setTableFitsPage(true);
            document.add(tab);

        }

        List<BoravakDrzava> boravci= new ArrayList<BoravakDrzava>();
        boravci = boravakDrzavaService.getBoravci(obracun.getBrPutnogNaloga());

        Paragraph paragraphB1 = new Paragraph("Boravci",fontTitle);
        paragraph.setAlignment(Paragraph.ALIGN_CENTER);
        document.add(paragraphB1);

        if(boravci.size()==0){
            Paragraph p = new Paragraph("Nema boravaka za prikaz.",fontParagraph);
            document.add(p);
        }

        for(BoravakDrzava boravak : boravci){
            Paragraph t = new Paragraph(boravak.toString());
            document.add(t);
        }

        document.close();



    }
}
