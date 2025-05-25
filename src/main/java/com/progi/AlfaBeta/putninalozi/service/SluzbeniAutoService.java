package com.progi.AlfaBeta.putninalozi.service;

import com.progi.AlfaBeta.putninalozi.domain.SluzbeniAuto;

import java.util.List;

public interface SluzbeniAutoService {

    public SluzbeniAuto addAuto(SluzbeniAuto sluzbeniAuto);

    List<SluzbeniAuto> listAll();

    public SluzbeniAuto deleteAuto(SluzbeniAuto sluzbeniAuto);

    public SluzbeniAuto findByRegistracija(String registracija);
}
