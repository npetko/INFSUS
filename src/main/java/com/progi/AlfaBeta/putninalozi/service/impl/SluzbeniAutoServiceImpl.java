package com.progi.AlfaBeta.putninalozi.service.impl;

import com.progi.AlfaBeta.putninalozi.dao.SluzbeniAutoRepository;
import com.progi.AlfaBeta.putninalozi.domain.SluzbeniAuto;
import com.progi.AlfaBeta.putninalozi.service.SluzbeniAutoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class SluzbeniAutoServiceImpl  implements SluzbeniAutoService {

    @Autowired
    private SluzbeniAutoRepository sluzbeniAutoRepo;


    @Override
    public SluzbeniAuto addAuto(SluzbeniAuto sluzbeniAuto) {
        sluzbeniAutoRepo.saveAndFlush(sluzbeniAuto);
        return sluzbeniAuto;
    }

    @Override
    public List<SluzbeniAuto> listAll() {
        return sluzbeniAutoRepo.findAll();
    }

    @Override
    public SluzbeniAuto deleteAuto(SluzbeniAuto sluzbeniAuto) {
        sluzbeniAutoRepo.delete(sluzbeniAuto);
        return sluzbeniAuto;
    }

    @Override
    public SluzbeniAuto findByRegistracija(String registracija) {
        return sluzbeniAutoRepo.findByRegistracija(registracija);
    }
}
