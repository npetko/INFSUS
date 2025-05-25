package com.progi.AlfaBeta.putninalozi.rest;


import com.progi.AlfaBeta.putninalozi.domain.Korisnik;
import com.progi.AlfaBeta.putninalozi.domain.Obracun;
import com.progi.AlfaBeta.putninalozi.domain.Zahtjev;
import com.progi.AlfaBeta.putninalozi.service.ObracunService;
import com.progi.AlfaBeta.putninalozi.service.PDFGeneratorService;
import com.progi.AlfaBeta.putninalozi.service.ZahtjevService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.json.JsonParser;
import org.springframework.boot.json.JsonParserFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;

@Controller
@RequestMapping("/")
public class PDFController {

    @Autowired
    private PDFGeneratorService pdfGeneratotService;

    @Autowired
    private ZahtjevService zahtjevService;

    @Autowired
    private ObracunService obracunService;

    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @GetMapping(value = "/zahtjev-pdf/{brPutnogNaloga}")
    public void generatePDFzahtjev(HttpServletResponse response, @PathVariable("brPutnogNaloga") String brPutnogNaloga) throws IOException//, @PathVariable("brPutnogNaloga") String brPutnogNaloga) throws IOException {
    {   Zahtjev zahtjev = zahtjevService.findByBrPutnogNaloga(brPutnogNaloga);
        response.setContentType("application/pdf");
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=zahtjev-" + brPutnogNaloga + ".pdf";
        response.setHeader(headerKey, headerValue);
        pdfGeneratotService.exportZahtjev(zahtjev,response);


    }

    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @GetMapping(value = "/obracun-pdf/{brPutnogNaloga}")
    public void generatePDFobracun(HttpServletResponse response, @PathVariable("brPutnogNaloga") String brPutnogNaloga) throws IOException//, @PathVariable("brPutnogNaloga") String brPutnogNaloga) throws IOException {
    {   Obracun obracun = obracunService.findByBr(brPutnogNaloga);
        response.setContentType("application/pdf");
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=obracun-" + brPutnogNaloga + ".pdf";
        response.setHeader(headerKey, headerValue);
        pdfGeneratotService.exportObracun(obracun,response);


    }


}
