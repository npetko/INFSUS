package com.progi.AlfaBeta.putninalozi.domain;

import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Korisnik {

    /*@Id
    @GeneratedValue
    private Long id;*/

    private String email;

    @Id
    @Column(name="korisnicko_ime")
    @Cascade(CascadeType.REMOVE)
    private String korisnickoIme;

    private String zaporka;

    /*public void setId(Long id) {
        this.id = id;
    }*/

    public void setEmail(String email) {
        this.email = email;
    }

    public void setKorisnickoIme(String korisnickoIme) {
        this.korisnickoIme = korisnickoIme;
    }

    public void setZaporka(String zaporka) {
        this.zaporka = zaporka;
    }

    public void setOib(String oib) {
        this.oib = oib;
    }

    private String oib;

    public String getOib() {
        return oib;
    }

    public String getKorisnickoIme() {
        return korisnickoIme;
    }

    public String getZaporka(){ return zaporka;}

    public String getEmail() {
        return email;
    }

    @Override
    public String toString() {
        return "Korisnik{" +
                "email='" + email + '\'' +
                ", korisnickoIme='" + korisnickoIme + '\'' +
                ", zaporka='" + zaporka + '\'' +
                ", oib='" + oib + '\'' +
                '}';
    }
}
