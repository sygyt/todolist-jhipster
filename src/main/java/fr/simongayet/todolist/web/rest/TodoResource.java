package fr.simongayet.todolist.web.rest;

import fr.simongayet.todolist.domain.Todo;
import fr.simongayet.todolist.repository.TodoRepository;
import java.util.List;
import javax.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for managing {@link fr.simongayet.todolist.domain.Todo}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TodoResource {

    private final Logger log = LoggerFactory.getLogger(TodoResource.class);

    private final TodoRepository todoRepository;

    public TodoResource(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    /**
     * {@code GET  /todos} : get all the todos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of todos in body.
     */
    @GetMapping("/todos")
    public List<Todo> getAllTodos() {
        log.debug("REST request to get all Todos");
        return todoRepository.findAll();
    }
}
