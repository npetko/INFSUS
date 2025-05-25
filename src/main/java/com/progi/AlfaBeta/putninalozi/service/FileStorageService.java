package com.progi.AlfaBeta.putninalozi.service;


import com.progi.AlfaBeta.putninalozi.domain.FileDB;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.IOException;
import java.util.stream.Stream;

public interface FileStorageService {
    // public FileDB store(MultipartFile file) throws IOException;

    FileDB store(MultipartFile file, String trosakId) throws IOException;

    @Transactional
    public FileDB getFile(Long id);

    public Stream<FileDB> getAllFiles();
    public void deleteFileById(Long id);
    }

