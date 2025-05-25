package com.progi.AlfaBeta.putninalozi.service.impl;

import com.progi.AlfaBeta.putninalozi.dao.FileDBRepository;
import com.progi.AlfaBeta.putninalozi.domain.FileDB;
import com.progi.AlfaBeta.putninalozi.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.IOException;
import java.util.stream.Stream;

@Service
public class FileStorageServiceImpl implements FileStorageService {
    @Autowired
    private FileDBRepository fileDBRepository;

    @Override
    public FileDB store(MultipartFile file, String trosakId) throws IOException {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        FileDB FileDB = new FileDB(fileName, file.getContentType(), file.getBytes());
        FileDB.setId(Long.parseLong(trosakId));
        return fileDBRepository.save(FileDB);
    }

    @Transactional
    @Override
    public FileDB getFile(Long id) {
        return fileDBRepository.findById(id);
    }

    public Stream<FileDB> getAllFiles() {
        return fileDBRepository.findAll().stream();
    }

    @Transactional
    @Override
    public void deleteFileById(Long id) {fileDBRepository.deleteById(id);}
}
