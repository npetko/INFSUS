package com.progi.AlfaBeta.putninalozi.dao;

import com.progi.AlfaBeta.putninalozi.domain.Obracun;
import com.progi.AlfaBeta.putninalozi.domain.Zahtjev;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ObracunRepository extends JpaRepository<Obracun, String> {

    public Obracun findByBrPutnogNaloga(String brPutnogNaloga);
}
