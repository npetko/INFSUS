package com.progi.AlfaBeta.putninalozi.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Getter
@Setter
@Entity
public class Firma {

    @Id
    @NotNull
    @Size(min=11, max=11)
    @Column(unique = true)
    private String oib;

    private String ime;

    private String adresa;

    private String email;

    @Override
    public String toString() {
        return "Firma{" +
                "oib='" + oib + '\'' +
                ", ime='" + ime + '\'' +
                ", adresa='" + adresa + '\'' +
                ", email='" + email + '\'' +
                '}';
    }

}
