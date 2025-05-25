package com.progi.AlfaBeta.putninalozi.dao;

import com.progi.AlfaBeta.putninalozi.domain.BoravakDrzava;
import com.progi.AlfaBeta.putninalozi.domain.Obracun;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BoravakDrzavaRepository extends JpaRepository<BoravakDrzava, String> {

    public List<BoravakDrzava> findByBrPutnogNaloga(String brPutnogNaloga);

}
