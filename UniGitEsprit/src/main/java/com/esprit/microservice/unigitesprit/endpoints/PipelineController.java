package com.esprit.microservice.unigitesprit.endpoints;

import com.esprit.microservice.unigitesprit.dto.PipelineDTO;
import com.esprit.microservice.unigitesprit.services.impl.PipelineServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/pipelines")
public class PipelineController {
    @Autowired
    private PipelineServiceImpl pipelineService;

    @PostMapping("/add")
    //@PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR')")
    public ResponseEntity<PipelineDTO> addPipeline(@RequestBody PipelineDTO pipelineDTO) {
        try {
            PipelineDTO createdPipeline = pipelineService.addPipeline(pipelineDTO);
            return ResponseEntity.ok(createdPipeline);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
    @PutMapping("/{id}")
   // @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR')")
    public ResponseEntity<PipelineDTO> editPipeline(@PathVariable Long id, @RequestBody PipelineDTO pipelineDTO) {
        try {
            pipelineDTO.setId(id);
            PipelineDTO updatedPipeline = pipelineService.editPipeline(pipelineDTO);
            return ResponseEntity.ok(updatedPipeline);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
    @GetMapping("/get-by-group/{groupId}")
    public ResponseEntity<PipelineDTO> getPipelineByGroupId(@PathVariable Long groupId) {
        PipelineDTO pipeline = pipelineService.getByGroupId(groupId);
        return ResponseEntity.ok(pipeline);
    }

    @GetMapping("/{id}")
    public String getPipeline(@PathVariable Long id) {
        return "Pipeline details";
    }

    @GetMapping("/projet/{projetId}")
    public String getPipelineByProject(@PathVariable Long projetId) {
        return "Pipeline of project";
    }
}
