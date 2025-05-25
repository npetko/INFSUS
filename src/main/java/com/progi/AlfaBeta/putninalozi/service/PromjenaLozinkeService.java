package com.progi.AlfaBeta.putninalozi.service;

import com.progi.AlfaBeta.putninalozi.domain.PromjenaLozinke;

import java.util.List;

public interface PromjenaLozinkeService {
    PromjenaLozinke findByUsername(String username);

    void addPromjenaLozinke(PromjenaLozinke promjenaLozinke);

    void deletePromjenaLozinke(PromjenaLozinke promjenaLozinke);

    List<PromjenaLozinke> listAll();
}
