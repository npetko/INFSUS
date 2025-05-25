package com.progi.AlfaBeta.putninalozi.dao;

import com.progi.AlfaBeta.putninalozi.domain.Drzava;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DrzavaRepository extends JpaRepository<Drzava, String> {

    Drzava findByImeDrzave(String imeDrzave);
}
