package fr.simongayet.todolist.web.rest;

import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import fr.simongayet.todolist.IntegrationTest;
import fr.simongayet.todolist.domain.Todo;
import fr.simongayet.todolist.repository.TodoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class TodoResourceIT {

    private static final String DEFAULT_TITLE = "Todo Title";

    private static final String ENTITY_API_URL = "/api/todos";

    @Autowired
    private TodoRepository todoRepository;

    @Autowired
    private MockMvc restTodoMockMvc;

    private Todo todo;

    private Todo createEntity() {
        return new Todo().title(DEFAULT_TITLE);
    }

    @BeforeEach
    void initTest() {
        todo = createEntity();
    }

    @Test
    @Transactional
    void getAllTodos() throws Exception {
        //Initialize the database
        todoRepository.saveAndFlush(todo);

        // Get all the todoList
        restTodoMockMvc
            .perform(get(ENTITY_API_URL))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(todo.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)));
    }
}
