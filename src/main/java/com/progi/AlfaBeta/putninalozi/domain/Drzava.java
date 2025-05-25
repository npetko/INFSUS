package com.progi.AlfaBeta.putninalozi.domain;

import lombok.Getter;

import javax.persistence.Entity;
import javax.persistence.Id;

@Getter
@Entity
public class Drzava {

    @Id
    private String sifraDrzave;

    private String imeDrzave;

    private String dnevnica;
}
