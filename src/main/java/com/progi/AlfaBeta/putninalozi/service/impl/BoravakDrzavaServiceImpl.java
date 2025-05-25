package com.progi.AlfaBeta.putninalozi.service.impl;

import com.progi.AlfaBeta.putninalozi.dao.BoravakDrzavaRepository;
import com.progi.AlfaBeta.putninalozi.domain.BoravakDrzava;
import com.progi.AlfaBeta.putninalozi.domain.Obracun;
import com.progi.AlfaBeta.putninalozi.service.BoravakDrzavaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BoravakDrzavaServiceImpl implements BoravakDrzavaService {

    @Autowired
    private BoravakDrzavaRepository boravakDrzavaRepo;

    @Override
    public BoravakDrzava addBoravak(BoravakDrzava boravak){
        boravakDrzavaRepo.saveAndFlush(boravak);
        return boravak;
    }

    @Override
    public List<BoravakDrzava> getBoravci(String brPutnogNaloga) {
        return boravakDrzavaRepo.findByBrPutnogNaloga(brPutnogNaloga);
    }

    @Override
    public BoravakDrzava deleteBoravak(BoravakDrzava boravakDrzava) {
        boravakDrzavaRepo.delete(boravakDrzava);
        return boravakDrzava;
    }
}
