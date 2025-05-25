package com.progi.AlfaBeta.putninalozi.domain;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.bind.annotation.GetMapping;

import javax.persistence.Entity;
import javax.persistence.Id;

@Getter
@Setter
@Entity
public class SluzbeniAuto {

    @Id
    private String registracija;

    private String model;
}
