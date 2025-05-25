package com.progi.AlfaBeta.putninalozi.domain;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Tim {

    @Id
    @GeneratedValue
    private Long id;

    private String oibVoditelja;

    private String oibZamjenik;
}
