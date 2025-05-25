package com.progi.AlfaBeta.putninalozi.service.impl;


import com.progi.AlfaBeta.putninalozi.dao.DrzavaRepository;
import com.progi.AlfaBeta.putninalozi.domain.Drzava;
import com.progi.AlfaBeta.putninalozi.service.DrzavaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DrzavaServiceImpl implements DrzavaService {

    @Autowired
    private DrzavaRepository drzavaRepo;

    @Override
    public Drzava getDrzava(String imeDrzave) {
        return drzavaRepo.findByImeDrzave(imeDrzave);
    }

    @Override
    public List<Drzava> listAll() {
        return drzavaRepo.findAll();
    }

    @Override
    public Drzava save(Drzava drzava) {
        return drzavaRepo.save(drzava);
    }

    @Override
    public void deleteById(String sifraDrzave) {
        drzavaRepo.deleteById(sifraDrzave);
    }
}
