package com.progi.AlfaBeta.putninalozi.domain;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Setter
@Getter
@Entity
public class Obracun {

    public Obracun() {}

    public Obracun(String brPutnogNaloga, String opis, LocalDateTime vrijPolazak, LocalDateTime vrijDolazak){
        this.brPutnogNaloga = brPutnogNaloga;
        this.opis = opis;
        this.vrijPolazak = vrijPolazak;
        this.vrijDolazak = vrijDolazak;
    }

    public Obracun(String brPutnogNaloga, String opis, String regAuto, String kilometri, LocalDateTime vrijPolazak, LocalDateTime vrijDolazak){
        this.brPutnogNaloga = brPutnogNaloga;
        this.opis = opis;
        this.vrijPolazak = vrijPolazak;
        this.vrijDolazak = vrijDolazak;
        this.regAuto = regAuto;
        this.kilometri = kilometri;
    }

    @Id
    private String brPutnogNaloga;

    private String opis;

    private String regAuto;

    private String kilometri;

    private LocalDateTime vrijPolazak;

    private LocalDateTime vrijDolazak;

    @NotNull
    @Enumerated(EnumType.STRING)
    private StatusObracun statusObracuna;

    private String razlogStorn;

    private Double izracun;

    public StatusObracun getStatusObracuna() {
        return statusObracuna;
    }
}
