package com.progi.AlfaBeta.putninalozi.rest;


import java.util.ArrayList;
import java.util.List;
        import java.util.stream.Collectors;

import com.progi.AlfaBeta.putninalozi.domain.FileDB;
import com.progi.AlfaBeta.putninalozi.message.ResponseFile;
import com.progi.AlfaBeta.putninalozi.message.ResponseMessage;
import com.progi.AlfaBeta.putninalozi.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;



@Controller
@CrossOrigin("http://localhost:3000")
public class FileController {

    @Autowired
    private FileStorageService storageService;

    @PostMapping(value = "/upload/{trosakId}")
    public ResponseEntity<ResponseMessage> uploadFile(@PathVariable("trosakId") String trosakId, @RequestParam("file") MultipartFile file) {
        String message = "";
        List<String> ext = new ArrayList<>();
        System.out.println(file.getContentType());
        ext.add("application/pdf");
        ext.add("image/jpeg");
        ext.add("image/jpg");
        ext.add("image/png");
        try {
            if(!ext.contains(file.getContentType())) {
                throw new Exception("Krivi tip datoteke.");
            }
            storageService.store(file, trosakId);
            message = "Datoteka uspješno poslana: " + file.getOriginalFilename();
            return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
        } catch (Exception e) {
            message = "Nije moguće poslati datoteku: " + file.getOriginalFilename() + "!";
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(new ResponseMessage(message));
        }
    }

    @GetMapping("/files")
    public ResponseEntity<List<ResponseFile>> getListFiles() {
        List<ResponseFile> files = storageService.getAllFiles().map(dbFile -> {
            String fileDownloadUri = ServletUriComponentsBuilder
                    .fromCurrentContextPath()
                    .path("/files/")
                    .path(dbFile.getId().toString())
                    .toUriString();

            return new ResponseFile(
                    dbFile.getName(),
                    fileDownloadUri,
                    dbFile.getType(),
                    dbFile.getData().length);
        }).collect(Collectors.toList());

        return ResponseEntity.status(HttpStatus.OK).body(files);
    }

    @GetMapping("/files/{id}")
    public ResponseEntity<byte[]> getFile(@PathVariable String id) {
        FileDB fileDB = storageService.getFile(Long.parseLong(id));

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileDB.getName() + "\"")
                .body(fileDB.getData());
    }
}