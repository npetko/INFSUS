package com.progi.AlfaBeta.putninalozi.domain;

import javax.persistence.Entity;
import javax.persistence.Enumerated;
import java.util.HashMap;
import java.util.Map;


public enum StatusObracun {
    U_PRIPREMI(1),
    SPREMAN_ZA_OBRACUN(2),
    STORNIRAN(3),
    OBRACUNATO(4),

    ODOBREN(5);

    private static Map mapInt = new HashMap<>();
    private int value;

    private StatusObracun(int value) {
        this.value = value;
    }

    static {
        for (StatusObracun status : StatusObracun.values()) {
            mapInt.put(status.value, status);
        }
    }

    public static StatusZahtjev valueOf(int status) {
        return (StatusZahtjev) mapInt.get(status);
    }

    public int getValue() {
        return value;
    }



}
