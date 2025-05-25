package com.progi.AlfaBeta.putninalozi;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;

import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class FrontendTest {

    @Test
    public void testLogin() {
        System.setProperty("webdriver.chrome.driver", "C:\\Program Files (x86)\\Chrome driver\\chromedriver.exe");
        WebDriver driver = new ChromeDriver();
        driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
        driver.get("http://localhost:3000/");

        WebElement element = driver.findElement(By.name("username"));
        element.sendKeys("mspalj");

        element = driver.findElement(By.name("password"));
        element.sendKeys("mspalj");

        driver.findElement(By.id("submit-login-bttn")).click();

        String redirURL = driver.getCurrentUrl();
        System.out.println(redirURL);

        boolean compRes = redirURL.contains("dashboard");
        assertEquals(true, compRes);
    }

    @Test
    public void testIspunjavanjeObracuna() {
        System.setProperty("webdriver.chrome.driver", "C:\\Program Files (x86)\\Chrome driver\\chromedriver.exe");
        WebDriver driver = new ChromeDriver();
        driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
        driver.get("http://localhost:3000/");

        driver.findElement(By.name("username")).sendKeys("hanic");
        driver.findElement(By.name("password")).sendKeys("hanic");
        driver.findElement(By.id("submit-login-bttn")).click();

        driver.findElement(By.id("moji-nalozi-bttn")).click();
        driver.findElement(By.name("otvori-nalog")).click();
        driver.findElement(By.id("otvori-obracun-bttn")).click();

        driver.findElement(By.name("regAuto")).sendKeys("ZG1258IL");
        driver.findElement(By.name("km")).sendKeys("120");
        driver.findElement(By.id("opis")).sendKeys("Kratki opis putovanja...");
        driver.findElement(By.id("predaja-obracuna-bttn")).click();
        driver.findElement(By.id("izadi-obracun-bttn")).click();

        WebElement element = driver.findElement(By.id("status-naloga"));
        assertEquals("Status: POSLAN_NA_OBRACUN", element.getText());
    }

    @Test
    public void testIspunjavanjeObracunaKriviPodaci() {
        System.setProperty("webdriver.chrome.driver", "C:\\Program Files (x86)\\Chrome driver\\chromedriver.exe");
        WebDriver driver = new ChromeDriver();
        driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
        driver.get("http://localhost:3000/");

        driver.findElement(By.name("username")).sendKeys("hanic");
        driver.findElement(By.name("password")).sendKeys("hanic");
        driver.findElement(By.id("submit-login-bttn")).click();

        driver.findElement(By.id("moji-nalozi-bttn")).click();
        driver.findElement(By.name("otvori-nalog")).click();
        driver.findElement(By.id("otvori-obracun-bttn")).click();

        driver.findElement(By.name("regAuto")).sendKeys("ZG1258IL");
        driver.findElement(By.id("opis")).sendKeys("Kratki opis putovanja...");
        driver.findElement(By.id("predaja-obracuna-bttn")).click();

        WebElement element = driver.findElement(By.id("status-obracuna"));
        assertEquals("Greška pri unosu prijeđenih kilometara.", element.getText());

    }

    @Test
    public void testObracunavanjeObracuna() {
        System.setProperty("webdriver.chrome.driver", "C:\\Program Files (x86)\\Chrome driver\\chromedriver.exe");
        WebDriver driver = new ChromeDriver();
        driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
        driver.get("http://localhost:3000/");

        driver.findElement(By.name("username")).sendKeys("mspalj");
        driver.findElement(By.name("password")).sendKeys("mspalj");
        driver.findElement(By.id("submit-login-bttn")).click();

        driver.findElement(By.id("racunovoda-svi-obracuni")).click();
        driver.findElement(By.id("otvori-obracun")).click();
        driver.findElement(By.id("obracunaj-obracun")).click();

        assertEquals("Status: OBRACUNATO", driver.findElement(By.id("status-obracuna")).getText());
    }

}

