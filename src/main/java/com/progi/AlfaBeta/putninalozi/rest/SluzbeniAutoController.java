package com.progi.AlfaBeta.putninalozi.rest;


import com.progi.AlfaBeta.putninalozi.domain.SluzbeniAuto;
import com.progi.AlfaBeta.putninalozi.service.SluzbeniAutoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.json.JsonParser;
import org.springframework.boot.json.JsonParserFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/sluzbeniAuto")
public class SluzbeniAutoController {

    @Autowired
    private SluzbeniAutoService sluzbeniAutoService;

    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @PostMapping(value = "/novi-auto", consumes = {"application/json"})
    public ResponseEntity<?> noviAuto(@RequestBody String autoData){
        JsonParser parser = JsonParserFactory.getJsonParser();

        Map<String, Object> autoMap = parser.parseMap(autoData);

        SluzbeniAuto sluzbeniAuto = new SluzbeniAuto();

        try{
            sluzbeniAuto.setRegistracija(autoMap.get("regAuto").toString());
        } catch (Exception e){
            return new ResponseEntity<>("Greška u unosu registracije", HttpStatus.OK);
        }

        try{
            sluzbeniAuto.setModel(autoMap.get("model").toString());
        } catch (Exception e){
            return new ResponseEntity<>("Greška pri unosu modela", HttpStatus.OK);
        }

        sluzbeniAutoService.addAuto(sluzbeniAuto);

        return new ResponseEntity<>("Uspješno unesen auto", HttpStatus.OK);

    }

    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @PostMapping(value = "/izbrisi-auto", consumes = {"application/json"})
    public ResponseEntity<?> izbrisiAuto(@RequestBody String autoData){
        JsonParser parser = JsonParserFactory.getJsonParser();

        Map<String, Object> autoMap = parser.parseMap(autoData);

        SluzbeniAuto sluzbeniAuto = sluzbeniAutoService.findByRegistracija(autoMap.get("regAuto").toString());

        sluzbeniAutoService.deleteAuto(sluzbeniAuto);

        return new ResponseEntity<>("Uspješno izbrisan auto", HttpStatus.OK);

    }

    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @GetMapping(value = "/popisAuta", produces = {"application/json"})
    public ResponseEntity<?> popisAuta(){

        List<SluzbeniAuto> auti = sluzbeniAutoService.listAll();

        List<String> pomocna = new ArrayList<>();


        for(SluzbeniAuto auto : auti){
            pomocna.add("{\"regAuto\":\"" + auto.getRegistracija() +
                    "\",\"model\":\"" + auto.getModel() + "\"}");
        }

        StringBuilder builder = new StringBuilder();

        builder.append("{\"sluzbeniAuti\":");
        builder.append(pomocna);
        builder.append("}");

        return new ResponseEntity<>(builder.toString(), HttpStatus.ACCEPTED);

    }
}
