package com.progi.AlfaBeta.putninalozi.service.impl;

import com.progi.AlfaBeta.putninalozi.dao.ZaposlenikRepository;
import com.progi.AlfaBeta.putninalozi.domain.StatusZahtjev;
import com.progi.AlfaBeta.putninalozi.domain.Zahtjev;
import com.progi.AlfaBeta.putninalozi.domain.Zaposlenik;
import com.progi.AlfaBeta.putninalozi.service.ZaposlenikService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
public class ZaposlenikServiceImpl implements ZaposlenikService {
    @Autowired
    private ZaposlenikRepository zaposlenikRepo;

    @Override
    public List<Zaposlenik> listAll(){
        return zaposlenikRepo.findAll();
    }

    @Override
    public Zaposlenik findByOib(String oib){
        return zaposlenikRepo.findByOib(oib);
    }

    @Override
    public List<Zaposlenik> findByTimId(int timId) {return zaposlenikRepo.findByTimId(timId);}

    @Override
    @Transactional
    public void deleteByOib(String oib) {
        zaposlenikRepo.deleteByOib(oib);
    }


/*
    @Override
    public Zaposlenik findByOib(String oib) {
        return zaposlenikRepo.findByOib(oib);

    }*/
}
