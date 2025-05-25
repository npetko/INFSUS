package com.progi.AlfaBeta.putninalozi.dao;

import com.progi.AlfaBeta.putninalozi.domain.Obracun;
import com.progi.AlfaBeta.putninalozi.domain.Trosak;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrosakRepository extends JpaRepository<Trosak, String> {

    public List<Trosak> findByObracun(Obracun obracun);

    public List<Trosak> findByBrPutnogNaloga(String brPutnogNaloga);
}
