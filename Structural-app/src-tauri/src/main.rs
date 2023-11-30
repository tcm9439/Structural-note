// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod open_file;
use open_file::{OpenedFile, OpenedFileList};
use std::sync::Mutex;

struct AppState {
    open_files: Mutex<OpenedFileList>,
}

impl AppState {
    fn new() -> AppState {
        AppState {
            open_files: Mutex::new(OpenedFileList::new()),
        }
    }
}

/// Open a file and add it to the list of opened files
/// If the file is already opened, return false
#[tauri::command]
fn try_open_file(state: tauri::State<AppState>, filepath: &str, window_id: String) -> bool {
    let file = OpenedFile::new_from_str(filepath, window_id);
    let mut opened_files = state.open_files.lock().unwrap();
    if opened_files.already_open(filepath) {
        return false;
    } else {
        opened_files.add_file(file);
        return true;
    }
}

#[tauri::command]
fn get_opened_note_for_window(state: tauri::State<AppState>, window_id: String) -> String {
    match state.open_files.lock().unwrap().get_file(&window_id) {
        Some(opened_file) => opened_file.file_path.to_str().unwrap().to_string(),
        None => String::from(""),
    }
}

fn main() {
   let app_state = AppState::new();
  tauri::Builder::default()
    .manage(app_state)
    .invoke_handler(tauri::generate_handler![try_open_file, get_opened_note_for_window])
    .run(tauri::generate_context!())
    .expect("Error while running tauri application.");
}
