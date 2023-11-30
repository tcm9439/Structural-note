use std::path::{Path,PathBuf};
use std::fs;

#[derive(PartialEq,Clone,Debug)]
pub struct OpenedFile {
    // Abs path to file
    pub file_path: PathBuf,
    pub window_id: String,
}

impl OpenedFile {
    pub fn new(file_path: &Path, window_id: String) -> OpenedFile {
        OpenedFile {
            file_path: fs::canonicalize(file_path).expect("Invalid file path").to_path_buf(),
            window_id,
        }
    }

    pub fn new_from_str(file_path: &str, window_id: String) -> OpenedFile {
        Self::new(Path::new(file_path), window_id)
    }
}

pub struct OpenedFileList {
    files: Vec<OpenedFile>,
}

impl OpenedFileList {
    pub fn new() -> OpenedFileList {
        OpenedFileList {
            files: Vec::new(),
        }
    }

    pub fn add_file(&mut self, file: OpenedFile) {
        self.files.push(file);
    }

    pub fn remove_file(&mut self, file: OpenedFile) {
        self.files.retain(|f| f.file_path != file.file_path);
    }

    pub fn already_open(&self, file_path: &str) -> bool {
        let file_path: PathBuf = fs::canonicalize(file_path).expect("Invalid file path").to_path_buf();
        self.files.iter().any(|f| f.file_path == file_path)
    }

    pub fn get_file(&self, window_id: &str) -> Option<&OpenedFile> {
        self.files.iter().find(|f| f.window_id == window_id)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn get_test_file() -> (OpenedFile, OpenedFile) {
        (OpenedFile::new(Path::new("./src/main.rs"), String::from("TEST")), 
        OpenedFile::new(Path::new("./src/open_file.rs"), String::from("TEST_2")))
    }
    
    #[test]
    fn test_new_opened_file() {
        let path = Path::new("./src/main.rs");
        let file = OpenedFile::new(path, String::from("TEST"));
        assert_eq!("TEST", file.window_id);
        assert!(file.file_path.to_str().unwrap().ends_with("src/main.rs"));
    }

    #[test]
    fn test_new_opened_file_list() {
        let list = OpenedFileList::new();
        assert_eq!(0, list.files.len());
    }

    #[test]
    fn test_eq_file() {
        let file = OpenedFile::new(Path::new("./src/main.rs"), String::from("TEST"));
        let file2 = OpenedFile::new(Path::new("../src-tauri/src/main.rs"), String::from("TEST"));
        assert_eq!(file, file2);
    }

    #[test]
    fn test_add_file() {
        let mut list = OpenedFileList::new();
        let (file, _) = get_test_file();
        list.add_file(file);
        assert_eq!(1, list.files.len());
    }

    #[test]
    fn test_remove_file() {
        let mut list = OpenedFileList::new();
        let (file, file2) = get_test_file();

        let file_dup = file.clone();
        let file2_dup = file2.clone();

        list.add_file(file); // file move to list
        list.add_file(file2);
        assert_eq!(2, list.files.len());
        
        list.remove_file(file_dup);
        assert_eq!(1, list.files.len());
        assert_eq!(&file2_dup, list.files.get(0).unwrap());
    }

    #[test]
    fn test_already_open() {
        let mut list = OpenedFileList::new();
        let (file, _) = get_test_file();
        list.add_file(file);
        assert_eq!(true, list.already_open("./src/main.rs"));
        assert_eq!(false, list.already_open("./src/open_file.rs"));
    }

    #[test]
    fn test_get_file() {
        let mut list = OpenedFileList::new();
        let (file, file2) = get_test_file();

        let file_dup = file.clone();
        let file2_dup = file2.clone();
        list.add_file(file);
        list.add_file(file2);
        assert_eq!(Some(&file_dup), list.get_file("TEST"));
        assert_eq!(Some(&file2_dup), list.get_file("TEST_2"));
    }
}