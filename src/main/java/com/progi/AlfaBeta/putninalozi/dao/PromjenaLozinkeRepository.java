package com.progi.AlfaBeta.putninalozi.dao;

import com.progi.AlfaBeta.putninalozi.domain.PromjenaLozinke;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PromjenaLozinkeRepository extends JpaRepository<PromjenaLozinke, String> {

    PromjenaLozinke findByUsername(String username);

}
