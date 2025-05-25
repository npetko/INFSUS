package com.progi.AlfaBeta.putninalozi.service.impl;

import com.progi.AlfaBeta.putninalozi.dao.PromjenaLozinkeRepository;
import com.progi.AlfaBeta.putninalozi.domain.PromjenaLozinke;
import com.progi.AlfaBeta.putninalozi.service.PromjenaLozinkeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PromjenaLozinkeServiceImpl implements PromjenaLozinkeService {

    @Autowired
    PromjenaLozinkeRepository promjenaLozinkeRepository;


    @Override
    public PromjenaLozinke findByUsername(String username) {
        return promjenaLozinkeRepository.findByUsername(username);
    }

    @Override
    public void addPromjenaLozinke(PromjenaLozinke promjenaLozinke) {
        promjenaLozinkeRepository.save(promjenaLozinke);
    }

    @Override
    public void deletePromjenaLozinke(PromjenaLozinke promjenaLozinke) {
        promjenaLozinkeRepository.delete(promjenaLozinke);
    }

    @Override
    public List<PromjenaLozinke> listAll() {
        return promjenaLozinkeRepository.findAll();
    }
}
