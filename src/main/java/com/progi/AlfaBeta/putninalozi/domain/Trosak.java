package com.progi.AlfaBeta.putninalozi.domain;


import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
public class Trosak {

    public Trosak(){}

    public Trosak(String brPutnogNaloga, String opis, double iznosValuta, String valuta, boolean refund){
        this.brPutnogNaloga = brPutnogNaloga;
        this.opis = opis;
        this.iznosValuta = iznosValuta;
        this.valuta = valuta;
        this.refund = refund;
    }

    @Id
    @GeneratedValue
    private Long idTrosak;

    private String brPutnogNaloga;

    @ManyToOne
    private Obracun obracun;

    private String opis;

    private double iznosValuta;

    private double iznosDomValuta;

    private String valuta;

    private boolean refund;

    public boolean getRefund(){
        return refund;
    }


    @Override
    public String toString(){
        return idTrosak + ": " + opis + "\nIznos u valuti: " + iznosValuta + "\nDomaca valuta: " + iznosDomValuta + "\nrefund: " + refund;
    }
}
