// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod open_file;
use open_file::{OpenedFile, OpenedFileList};
use tauri::Manager;
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

/// Add a file to the list of opened files
/// If the file is already opened, return false
#[tauri::command]
fn try_open_file(state: tauri::State<AppState>, filepath: String, window_id: String) -> bool {
    let file = OpenedFile::new_from_str(&filepath, window_id);
    let mut opened_files = state.open_files.lock().unwrap();
    let (opened, init_finish) = opened_files.already_open(&filepath);
    if opened && init_finish {
        false
    } else if opened && !init_finish {
        // this is a call to init the window
        opened_files.init_file(&filepath);
        true
    } else {
        // file is not opened by other window
        opened_files.add_file(file);
        true
    }
}

#[tauri::command]
fn is_file_already_open(state: tauri::State<AppState>, filepath: &str) -> bool {
    let opened_files = state.open_files.lock().unwrap();
    let (opened, _init_finish) = opened_files.already_open(filepath);
    println!("is_file_already_open: {}", opened);
    opened
}

#[tauri::command]
fn remove_opened_file(state: tauri::State<AppState>, window_id: &str) {
    let mut opened_files = state.open_files.lock().unwrap();
    opened_files.remove_file_by_window_id(window_id);
}

#[tauri::command]
fn get_opened_note_for_window(state: tauri::State<AppState>, window_id: String) -> String {
    match state.open_files.lock().unwrap().get_file(&window_id) {
        Some(opened_file) => opened_file.file_path.to_str().unwrap().to_string(),
        None => String::from(""),
    }
}

fn on_window_event_handler(event: tauri::GlobalWindowEvent) {
    if let tauri::WindowEvent::Destroyed = event.event() {
        let window_id = event.window().label();
        println!("Window {:?} close requested", window_id);
        let state: tauri::State<AppState> = event.window().state();
        let mut opened_files = state.open_files.lock().unwrap();
        opened_files.remove_file_by_window_id(&window_id);
    }
}

fn main() {
   let app_state = AppState::new();
  tauri::Builder::default()
    .manage(app_state)
    .invoke_handler(tauri::generate_handler![try_open_file, remove_opened_file, is_file_already_open, get_opened_note_for_window])
    .on_window_event(on_window_event_handler)
    .run(tauri::generate_context!())
    .expect("Error while running tauri application.");
}
