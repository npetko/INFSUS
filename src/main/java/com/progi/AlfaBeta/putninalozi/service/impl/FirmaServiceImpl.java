package com.progi.AlfaBeta.putninalozi.service.impl;

import com.progi.AlfaBeta.putninalozi.dao.FirmaRepository;
import com.progi.AlfaBeta.putninalozi.domain.Firma;
import com.progi.AlfaBeta.putninalozi.service.FirmaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
public class FirmaServiceImpl implements FirmaService {

    @Autowired
    private FirmaRepository firmaRepository;

    @Override
    @Transactional
    public Firma update(Firma firma) {
        firmaRepository.deleteAll();
        Firma updateResponse = firmaRepository.save(firma);
        return updateResponse;
    }

    @Override
    public Firma findByOib(String oib) {
        return firmaRepository.findByOib(oib);
    }

    @Override
    public List<Firma> listAll() {
        return firmaRepository.findAll();
    }

}
