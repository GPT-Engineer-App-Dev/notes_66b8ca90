import React, { useState } from "react";
import { ChakraProvider, Box, VStack, HStack, IconButton, Input, Textarea, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, useToast, Heading } from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrashAlt } from "react-icons/fa";

const Note = ({ content, onEdit, onDelete }) => (
  <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
    <VStack align="stretch">
      <Box>{content.text}</Box>
      <HStack justifyContent="flex-end">
        <IconButton size="sm" icon={<FaEdit />} aria-label="Edit note" onClick={onEdit} />
        <IconButton size="sm" icon={<FaTrashAlt />} aria-label="Delete note" onClick={onDelete} />
      </HStack>
    </VStack>
  </Box>
);

const Index = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState({ text: "" });
  const [isEditing, setIsEditing] = useState(false);

  const handleNoteChange = (e) => {
    setCurrentNote({
      ...currentNote,
      text: e.target.value,
    });
  };

  const handleSaveNote = () => {
    if (isEditing) {
      setNotes(notes.map((note) => (note.id === currentNote.id ? currentNote : note)));
    } else {
      setNotes([...notes, { ...currentNote, id: Date.now() }]);
    }
    setCurrentNote({ text: "" });
    setIsEditing(false);
    onClose();
    toast({
      title: isEditing ? "Note updated" : "Note created",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleEditNote = (note) => {
    setCurrentNote(note);
    setIsEditing(true);
    onOpen();
  };

  const handleDeleteNote = (noteId) => {
    setNotes(notes.filter((note) => note.id !== noteId));
    toast({
      title: "Note deleted",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <ChakraProvider>
      <Box p={4}>
        <VStack spacing={4} align="stretch">
          <Heading as="h1" size="xl">
            Notes
          </Heading>
          <IconButton icon={<FaPlus />} aria-label="Add note" onClick={onOpen} />
          <VStack spacing={4}>
            {notes.map((note) => (
              <Note key={note.id} content={note} onEdit={() => handleEditNote(note)} onDelete={() => handleDeleteNote(note.id)} />
            ))}
          </VStack>
        </VStack>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditing ? "Edit Note" : "New Note"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea placeholder="Type here..." value={currentNote.text} onChange={handleNoteChange} />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSaveNote}>
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
};

export default Index;
