package com.tonomus.core.services.impl;

import java.util.Collections;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class AemEnvServiceImplTest {

    @Test
    void aemEnvServiceImplTest() {
        AemEnvServiceImpl aemEnvService = new AemEnvServiceImpl();

        aemEnvService.activate(Collections.singletonMap("author", true));
        assertTrue(aemEnvService.isAuthor());

        aemEnvService.activate(Collections.singletonMap("author", false));
        assertFalse(aemEnvService.isAuthor());
    }
}