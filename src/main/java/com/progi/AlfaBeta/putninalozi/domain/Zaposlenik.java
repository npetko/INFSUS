package com.progi.AlfaBeta.putninalozi.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Entity
@Getter
@Setter
public class Zaposlenik {
    @Id
    @NotNull
    @Size(min=11, max=11)
    @Column(unique = true)
    private String oib;

    @NotNull
    private String ime;

    public void setIme(String ime) {
        this.ime = ime;
    }

    public void setPrezime(String prezime) {
        this.prezime = prezime;
    }

    public void setUloga(Uloga uloga) {
        this.uloga = uloga;
    }

    public void setTimId(int timId) {
        this.timId = timId;
    }

    public void setOib(String oib) {
        this.oib = oib;
    }

    @NotNull
    private String prezime;

    @Enumerated(EnumType.STRING)
    private Uloga uloga;

    public Uloga getUloga() {
        return uloga;
    }

    private int timId;

    @Override
    public String toString() {
        return "\"oib\":\""+ oib + "\", \"ime\":\""+ ime +"\",\"prezime\":\"" + prezime + "\" ,\"uloga\":\"" + uloga + "\", \"timid\":\"" + timId + "\"";
    }

    public String getOib() {
        return oib;
    }

    public String getIme() {
        return ime;
    }

    public String getPrezime() {
        return prezime;
    }

    public int getTimId() {return timId;}
}
