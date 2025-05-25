package com.progi.AlfaBeta.putninalozi.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import java.time.LocalDate;
import java.time.LocalDateTime;
@Setter
@Getter
@Entity
public class BoravakDrzava {

    public BoravakDrzava(){}

    public BoravakDrzava(String imeDrzave, String brPutnogNaloga, LocalDateTime vrijDolazak, LocalDateTime vrijOdlazak) {
        this.imeDrzave = imeDrzave;
        this.brPutnogNaloga = brPutnogNaloga;
        this.vrijDolazak = vrijDolazak;
        this.vrijOdlazak = vrijOdlazak;
    }

    @Id
    @GeneratedValue
    private long idBoravak;

    private String sifDrzave;

    private String imeDrzave;

    @ManyToOne
    private Obracun obracun;

    private String brPutnogNaloga;

    private double dnevnica;

    private LocalDateTime vrijDolazak;

    private LocalDateTime vrijOdlazak;

    @Override
    public String toString(){
        return sifDrzave + ": Dolazak: " + vrijDolazak + ", odlazak: " + vrijOdlazak;
    }

}
