package com.progi.AlfaBeta.putninalozi.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
public class PromjenaLozinke {

    @Id
    private String username;

}
