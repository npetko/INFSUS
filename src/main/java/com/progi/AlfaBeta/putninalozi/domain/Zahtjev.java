package com.progi.AlfaBeta.putninalozi.domain;

import com.progi.AlfaBeta.putninalozi.service.ZahtjevService;
import com.progi.AlfaBeta.putninalozi.service.impl.ZahtjevServiceImpl;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.sql.Time;
import java.time.LocalDateTime;

import java.util.Date;

@Entity
public class Zahtjev {

    public Zahtjev(String brPutnogNaloga,
                   String korisnickoIme,
                   LocalDateTime PocPutovanja,
                   LocalDateTime KrajPutovanja,
                   String mjesto,
                   String sifDrzava,
                   String razlog,
                   String prijevoznoSredstvo,
                   String mjestoTroska,
                   Double akontacija) {
        this.brPutnogNaloga = brPutnogNaloga;
        this.korisnickoIme = korisnickoIme;
        this.PocPutovanja = PocPutovanja;
        this.KrajPutovanja = KrajPutovanja;
        this.mjesto = mjesto;
        this.sifDrzava = sifDrzava;
        this.razlog= razlog;
        this.prijevoznoSredstvo = prijevoznoSredstvo;
        this.mjestoTroska=mjestoTroska;
        this.akontacija=akontacija;
    }

    public Zahtjev(String brPutnogNaloga,
                   LocalDateTime pocPutovanja,
                   LocalDateTime krajPutovanja,
                   String sifDrzava,
                   double akontacija){
        this.brPutnogNaloga = brPutnogNaloga;
        this.PocPutovanja = pocPutovanja;
        this.KrajPutovanja = krajPutovanja;
        this.sifDrzava = sifDrzava;
        this.akontacija = akontacija;
    }

    public Zahtjev(){}

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="br_putnog_naloga")
    private String brPutnogNaloga;

    @Column(name="korisnicko_ime")
    private String korisnickoIme;

    @Column(name="poc_putovanja")
    private LocalDateTime PocPutovanja;

    @Column(name="kraj_putovanja")
    private LocalDateTime KrajPutovanja;

    private String mjesto;

    @Column(name="sif_drzava")
    private String sifDrzava;

    private String razlog;

    @Column(name="prijevozno_sredstvo")
    private String prijevoznoSredstvo;

    @Column(name="mjesto_troska")
    private String mjestoTroska;

    private Double akontacija;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @NotNull
    @Enumerated(EnumType.STRING)
    private StatusZahtjev status;

    @Column(name="razlog_vracanja")
    private String razlogVracanja;

    public String getBrPutnogNaloga() {
        return brPutnogNaloga;
    }

    public StatusZahtjev getStatus() {
        return status;
    }

    public Double getAkontacija() {
        return akontacija;
    }

    public String getSifDrzava() {
        return sifDrzava;
    }

    public String getKorisnickoIme() {
        return korisnickoIme;
    }

    public void setStatus(StatusZahtjev status) {
        this.status = status;
    }

    public LocalDateTime getKrajPutovanja() {
        return KrajPutovanja;
    }

    public LocalDateTime getPocPutovanja() {
        return PocPutovanja;
    }

    public String getMjesto() {
        return mjesto;
    }

    public String getMjestoTroska() {
        return mjestoTroska;
    }

    public String getPrijevoznoSredstvo() {
        return prijevoznoSredstvo;
    }

    public String getRazlog() {
        return razlog;
    }

    public String getRazlogVracanja() {
        return razlogVracanja;
    }

    public void setBrPutnogNaloga(String brPutnogNaloga) {
        this.brPutnogNaloga = brPutnogNaloga;
    }

    public void setKorisnickoIme(String korisnickoIme) {
        this.korisnickoIme = korisnickoIme;
    }

    public void setPocPutovanja(LocalDateTime pocPutovanja) {
        PocPutovanja = pocPutovanja;
    }

    public void setKrajPutovanja(LocalDateTime krajPutovanja) {
        KrajPutovanja = krajPutovanja;
    }

    public void setMjesto(String mjesto) {
        this.mjesto = mjesto;
    }

    public void setSifDrzava(String sifDrzava) {
        this.sifDrzava = sifDrzava;
    }

    public void setRazlog(String razlog) {
        this.razlog = razlog;
    }

    public void setPrijevoznoSredstvo(String prijevoznoSredstvo) {
        this.prijevoznoSredstvo = prijevoznoSredstvo;
    }

    public void setMjestoTroska(String mjestoTroska) {
        this.mjestoTroska = mjestoTroska;
    }

    public void setAkontacija(Double akontacija) {
        this.akontacija = akontacija;
    }

    public void setRazlogVracanja(String razlogVracanja) {
        this.razlogVracanja = razlogVracanja;
    }

    @Override
    public String toString() {
        return brPutnogNaloga + " " + korisnickoIme + "\nmjesto: " + mjesto + "\ndatum pocetka putovanja: " + PocPutovanja + "\ndatum kraja putovanja: " + KrajPutovanja;
    }
}

