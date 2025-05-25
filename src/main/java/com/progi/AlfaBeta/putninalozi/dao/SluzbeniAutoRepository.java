package com.progi.AlfaBeta.putninalozi.dao;

import com.progi.AlfaBeta.putninalozi.domain.SluzbeniAuto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SluzbeniAutoRepository extends JpaRepository<SluzbeniAuto, String> {

    public SluzbeniAuto findByRegistracija(String registracija);
}
