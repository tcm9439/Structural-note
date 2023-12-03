use std::collections::HashMap;
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
    pub fn new(file_path: &String, window_id: String) -> OpenedFile {
        OpenedFile {
            file_path: OpenedFile::get_full_path(file_path),
            window_id,
            finish_init: false,
        }
    }

    /// Get the absolute path of a file
    pub fn get_full_path(file_path: &str) -> PathBuf {
        fs::canonicalize(file_path).expect("Invalid file path").to_path_buf()
    }
}

pub struct OpenedFileList {
    files: Vec<OpenedFile>,
    /// Map window_id to opened file index in files
    window_id_to_opened_file: HashMap<String, usize>,
    /// Map file path to opened file index in files
    file_to_opened_file: HashMap<PathBuf, usize>,
}

impl OpenedFileList {
    pub fn new() -> OpenedFileList {
        OpenedFileList {
            file_to_opened_file: HashMap::new(),
            window_id_to_opened_file: HashMap::new(),
            files: Vec::new(),
        }
    }

    pub fn add_file(&mut self, file: OpenedFile) {
        let index = self.files.len();
        self.files.push(file.clone());
        self.window_id_to_opened_file.insert(file.window_id.clone(), index);
        self.file_to_opened_file.insert(file.file_path.clone(), index);
    }

    pub fn remove_file_by_window_id(&mut self, window_id: &str) {
        match self.window_id_to_opened_file.get(window_id) {
            Some(index) => {
                let file = self.files.get(*index).unwrap();
                self.window_id_to_opened_file.remove(window_id);
                self.file_to_opened_file.remove(&file.file_path);
            },
            None => (),
        }
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
        let index = self.window_id_to_opened_file.get(window_id);
        match index {
            Some(index) => self.files.get(*index),
            None => None,
        }
    }

    pub fn get_file_by_filepath(&self, file_path: &str) -> Option<&OpenedFile> {
        let file_path: PathBuf = OpenedFile::get_full_path(file_path);
        let index = self.file_to_opened_file.get(&file_path);
        match index {
            Some(index) => self.files.get(*index),
            None => None,
        }
    }

    pub fn get_mut_file_by_filepath(&mut self, file_path: &str) -> Option<&mut OpenedFile> {
        let file_path: PathBuf = OpenedFile::get_full_path(file_path);
        let index = self.file_to_opened_file.get(&file_path);
        match index {
            Some(index) => self.files.get_mut(*index),
            None => None,
        }
    }

    pub fn get_mut_file_by_window_id(&mut self, window_id: &str) -> Option<&mut OpenedFile> {
        let index = self.window_id_to_opened_file.get(window_id);
        match index {
            Some(index) => self.files.get_mut(*index),
            None => None,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn get_test_file() -> (OpenedFile, OpenedFile) {
        (OpenedFile::new(&String::from("./src/main.rs"), String::from("TEST")), 
        OpenedFile::new(&String::from("./src/open_file.rs"), String::from("TEST_2")))
    }

    fn assert_file_count(list: &OpenedFileList, count: usize) {
        assert_eq!(count, list.window_id_to_opened_file.len());
        assert_eq!(count, list.file_to_opened_file.len());
    }
    
    #[test]
    fn test_new_opened_file() {
        let file = OpenedFile::new(&String::from("./src/main.rs"), String::from("TEST"));
        assert_eq!("TEST", file.window_id);
        assert!(file.file_path.to_str().unwrap().ends_with("src/main.rs"));
    }

    #[test]
    fn test_new_opened_file_list() {
        let list = OpenedFileList::new();
        assert_file_count(&list, 0);
    }

    #[test]
    fn test_eq_file() {
        let file = OpenedFile::new(&String::from("./src/main.rs"), String::from("TEST"));
        let file2 = OpenedFile::new(&String::from("../src-tauri/src/main.rs"), String::from("TEST"));
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