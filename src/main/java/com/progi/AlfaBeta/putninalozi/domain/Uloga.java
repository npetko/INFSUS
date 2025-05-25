package com.progi.AlfaBeta.putninalozi.domain;


import java.util.HashMap;
import java.util.Map;

public enum Uloga {
    ZAPOSLENIK(1),
    VODITELJ(2),
    ZAMJENIK(3),
    RACUNOVODA(4),
    ADMIN(5);

    private static Map mapInt = new HashMap<>();
    private int value;

    private Uloga(int value) {
        this.value = value;
    }

    static {
        for (Uloga uloga : Uloga.values()) {
            mapInt.put(uloga.value, uloga);
        }
    }

    public static Uloga valueOf(int uloga) {
        return (Uloga) mapInt.get(uloga);
    }

    public int getValue() {
        return value;
    }
}
