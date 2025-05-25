package com.progi.AlfaBeta.putninalozi.service.impl;

import com.progi.AlfaBeta.putninalozi.dao.TrosakRepository;
import com.progi.AlfaBeta.putninalozi.domain.Obracun;
import com.progi.AlfaBeta.putninalozi.domain.Trosak;
import com.progi.AlfaBeta.putninalozi.service.TrosakService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrosakServiceImpl implements TrosakService {

    @Autowired
    private TrosakRepository trosakRepo;

    @Override
    public Trosak addTrosak(Trosak trosak){
        trosakRepo.saveAndFlush(trosak);
        return trosak;
    }

    @Override
    public List<Trosak> getTroskovi(String brPutnogNaloga) {
        return trosakRepo.findByBrPutnogNaloga(brPutnogNaloga);
    }

    @Override
    public Trosak deleteTrosak(Trosak trosak) {
        trosakRepo.delete(trosak);
        return trosak;
    }

}
