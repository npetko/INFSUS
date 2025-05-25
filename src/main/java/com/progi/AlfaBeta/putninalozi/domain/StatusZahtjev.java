package com.progi.AlfaBeta.putninalozi.domain;

import javax.persistence.Entity;
import java.util.HashMap;
import java.util.Map;


public enum StatusZahtjev {
    U_PRIPREMI(1),
    PODNESEN(2),
    VRACEN_NA_DORADU(3),
    ODOBREN(4),
    ODBIJEN(5),
    STORNIRAN (6),
    POSLAN_NA_OBRACUN(7);

    private static Map mapInt = new HashMap<>();
    private int value;

    private StatusZahtjev(int value) {
        this.value = value;
    }

    static {
        for (StatusZahtjev status : StatusZahtjev.values()) {
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
