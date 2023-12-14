use std::collections::HashMap;
use std::io::Error;
use std::path::PathBuf;
use std::fs;
// use log::{debug, info, warn, error};

/// A file opened by one window of the app
/// One file can only be opened by one window at a time
#[derive(PartialEq,Clone,Debug)]
pub struct OpenedFile {
    // Abs path to file
    pub file_path: PathBuf,
    pub window_id: String,
    pub finish_init: bool,
}

impl OpenedFile {
    pub fn new(file_path: &String, window_id: String) -> Result<OpenedFile, Error> {
        Ok(OpenedFile {
            file_path: OpenedFile::get_full_path(file_path)?,
            window_id,
            finish_init: false,
        })
    }

    /// Get the absolute path of a file
    pub fn get_full_path(file_path: &str) -> Result<PathBuf, Error> {
        // fs::canonicalize(file_path).expect("Invalid file path").to_path_buf()
        fs::canonicalize(file_path)
    }
}

pub struct OpenedFileList {
    /// Map window_id to opened file
    window_id_to_opened_file: HashMap<String, OpenedFile>,
    /// Map file path to windowId
    filepath_to_window_id: HashMap<PathBuf, String>,
}

impl OpenedFileList {
    pub fn new() -> OpenedFileList {
        OpenedFileList {
            window_id_to_opened_file: HashMap::new(),
            filepath_to_window_id: HashMap::new(),
        }
    }

    pub fn add_file(&mut self, file: OpenedFile) {
        self.filepath_to_window_id.insert(file.file_path.clone(), file.window_id.clone());
        self.window_id_to_opened_file.insert(file.window_id.clone(), file);
    }

    pub fn remove_file_by_window_id(&mut self, window_id: &str) {
        match self.window_id_to_opened_file.get(window_id) {
            Some(file) => {
                self.filepath_to_window_id.remove(&file.file_path);
            },
            None => (),
        }
        self.window_id_to_opened_file.remove(window_id);
    }

    /// Check if a file is already opened and initialized
    pub fn already_open(&self, file_path: &str) -> (bool, bool) {
        let opened_file = self.get_file_by_filepath(file_path);
        match opened_file {
            Some(file) => {
                (true, file.finish_init)
            },
            None => (false, false),
        }
    }

    pub fn init_window(&mut self, window_id: &str) {
        if let Some(file) = self.get_mut_file_by_window_id(window_id) {
            file.finish_init = true;
        }
    }

    pub fn get_file_by_window_id(&self, window_id: &str) -> Option<&OpenedFile> {
        self.window_id_to_opened_file.get(window_id)
    }

    pub fn get_file_by_filepath(&self, file_path: &str) -> Option<&OpenedFile> {
        if let Ok(full_file_path) = OpenedFile::get_full_path(file_path){
            if let Some(window_id) = self.filepath_to_window_id.get(&full_file_path){
                return self.get_file_by_window_id(window_id)
            }
        }
        None
    }

    pub fn get_mut_file_by_filepath(&mut self, file_path: &str) -> Option<&mut OpenedFile> {
        if let Ok(full_file_path) = OpenedFile::get_full_path(file_path){
            if let Some(window_id) = self.filepath_to_window_id.get(&full_file_path){
                return self.window_id_to_opened_file.get_mut(window_id)
            }
        }
        None
    }

    pub fn get_mut_file_by_window_id(&mut self, window_id: &str) -> Option<&mut OpenedFile> {
        self.window_id_to_opened_file.get_mut(window_id)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn get_test_file() -> (OpenedFile, OpenedFile) {

        (
            OpenedFile::new(&String::from("./src/main.rs"), String::from("TEST")).unwrap(), 
            OpenedFile::new(&String::from("./src/open_file.rs"), String::from("TEST_2")).unwrap()
        )
    }

    fn assert_file_count(list: &OpenedFileList, count: usize) {
        assert_eq!(count, list.window_id_to_opened_file.len());
        assert_eq!(count, list.filepath_to_window_id.len());
    }
    
    #[test]
    fn test_new_opened_file() {
        let file = OpenedFile::new(&String::from("./src/main.rs"), String::from("TEST")).unwrap();
        assert_eq!("TEST", file.window_id);
        assert!(file.file_path.to_str().unwrap().ends_with("src/main.rs"));

        let not_exist_file_result = OpenedFile::new(&String::from("./src/main9999.rs"), String::from("TEST"));
        assert!(not_exist_file_result.is_err())
    }

    #[test]
    fn test_new_opened_file_list() {
        let list = OpenedFileList::new();
        assert_file_count(&list, 0);
    }

    #[test]
    fn test_eq_file() {
        let file = OpenedFile::new(&String::from("./src/main.rs"), String::from("TEST")).unwrap();
        let file2 = OpenedFile::new(&String::from("../src-tauri/src/main.rs"), String::from("TEST")).unwrap();
        assert_eq!(file, file2);
    }

    #[test]
    fn test_add_file() {
        let mut list = OpenedFileList::new();
        let (file, _) = get_test_file();
        list.add_file(file);
        assert_file_count(&list, 1);
    }

    #[test]
    fn test_remove_file() {
        let mut list = OpenedFileList::new();
        let (file, file2) = get_test_file();

        let file_dup = file.clone();
        let file2_dup = file2.clone();

        list.add_file(file);
        list.add_file(file2);
        assert_file_count(&list, 2);
        
        list.remove_file_by_window_id(&file_dup.window_id);
        assert_file_count(&list, 1);
        assert_eq!(Some(&file2_dup), list.get_file_by_window_id(&file2_dup.window_id));
    }

    #[test]
    fn test_already_open() {
        let mut list = OpenedFileList::new();
        let (file, _) = get_test_file();
        list.add_file(file);

        let (opened, init_finish) = list.already_open("./src/main.rs");
        assert_eq!(true, opened);
        assert_eq!(false, init_finish);
        let (opened, init_finish) = list.already_open("./src/open_file.rs");
        assert_eq!(false, opened);
        assert_eq!(false, init_finish);
    }

    #[test]
    fn test_get_file() {
        let mut list = OpenedFileList::new();
        let (file, file2) = get_test_file();

        let mut file_dup = file.clone();
        let file2_dup = file2.clone();
        list.add_file(file);
        list.add_file(file2);
        assert_eq!(Some(&file_dup), list.get_file_by_filepath("./src/main.rs"));
        assert_eq!(Some(&mut file_dup), list.get_mut_file_by_filepath("./src/main.rs"));
        assert_eq!(Some(&file2_dup), list.get_file_by_window_id("TEST_2"));
    }
}