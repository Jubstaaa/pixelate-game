"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

export default function CharacterManager() {
  const [characters, setCharacters] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [bulkName, setBulkName] = useState("");
  const [bulkCategoryId, setBulkCategoryId] = useState("");
  const [bulkCharacters, setBulkCharacters] = useState([]);
  const [localPreview, setLocalPreview] = useState(null);
  const fileInputRef = useRef(null);
  const bulkFileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    characterImage: "",
    categoryId: "",
  });

  const fetchData = async () => {
    try {
      const token = sessionStorage.getItem("adminToken");
      const [charactersRes, categoriesRes] = await Promise.all([
        fetch("/api/characters", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch("/api/categories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      if (!charactersRes.ok || !categoriesRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const [charactersData, categoriesData] = await Promise.all([
        charactersRes.json(),
        categoriesRes.json(),
      ]);

      setCharacters(charactersData);
      setCategories(categoriesData);
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLocalFileSelect = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setLocalPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const uploadToBlob = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "character");

    const token = sessionStorage.getItem("adminToken");
    const response = await fetch("/api/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) throw new Error("Upload failed");
    const data = await response.json();
    return data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUploadingFile(true);
      const file = fileInputRef.current?.files[0];
      let imageUrl = formData.characterImage;

      if (file) {
        imageUrl = await uploadToBlob(file);
      }

      const token = sessionStorage.getItem("adminToken");
      const url = editingCharacter
        ? `/api/characters/${editingCharacter.id}`
        : "/api/characters";

      const method = editingCharacter ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          characterImage: imageUrl,
        }),
      });

      if (!response.ok) throw new Error("Failed to save character");

      toast.success(
        `Character ${editingCharacter ? "updated" : "created"} successfully`
      );
      setIsDialogOpen(false);
      fetchData();
      resetForm();
    } catch (error) {
      toast.error("Failed to save character");
    } finally {
      setUploadingFile(false);
      setLocalPreview(null);
    }
  };

  const handleBulkFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      // Create local previews for each file
      const newCharacters = await Promise.all(
        files.map(async (file) => {
          const preview = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
          });
          return {
            file,
            preview,
            name: "",
            categoryId: bulkCategoryId,
          };
        })
      );

      setBulkCharacters((prev) => [...prev, ...newCharacters]);
      toast.success(`${files.length} images selected`);
    } catch (error) {
      toast.error("Failed to process images");
    } finally {
      e.target.value = null; // Reset file input
    }
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    if (!bulkCategoryId) {
      toast.error("Category is required");
      return;
    }

    if (bulkCharacters.some((char) => !char.name)) {
      toast.error("All characters must have a name");
      return;
    }

    try {
      setBulkUploading(true);
      // Upload all files to blob storage
      const uploadPromises = bulkCharacters.map(async (char) => {
        const formData = new FormData();
        formData.append("file", char.file);
        formData.append("type", "character");
        const token = sessionStorage.getItem("adminToken");
        const response = await fetch("/api/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        if (!response.ok) throw new Error("Upload failed");
        const data = await response.json();
        return {
          name: char.name,
          categoryId: parseInt(bulkCategoryId),
          characterImage: data.url,
        };
      });

      const uploadedCharacters = await Promise.all(uploadPromises);

      // Create all characters
      const token = sessionStorage.getItem("adminToken");
      const response = await fetch("/api/characters/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          characters: uploadedCharacters,
        }),
      });

      if (!response.ok) throw new Error("Failed to create characters");

      toast.success("Characters created successfully");
      setIsBulkDialogOpen(false);
      setBulkCharacters([]);
      setBulkCategoryId("");
      fetchData();
    } catch (error) {
      toast.error("Failed to create characters");
    } finally {
      setBulkUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this character?")) return;

    try {
      const token = sessionStorage.getItem("adminToken");
      const response = await fetch(`/api/characters/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete character");
      }

      toast.success("Character deleted successfully");
      fetchData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEdit = (character) => {
    setEditingCharacter(character);
    setFormData({
      name: character.name,
      characterImage: character.characterImage || "",
      categoryId: character.categoryId.toString(),
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      characterImage: "",
      categoryId: "",
    });
    setEditingCharacter(null);
  };

  const removeBulkCharacter = (index) => {
    setBulkCharacters(bulkCharacters.filter((_, i) => i !== index));
  };

  const updateBulkCharacterName = (index, name) => {
    setBulkCharacters((prev) =>
      prev.map((char, i) => (i === index ? { ...char, name } : char))
    );
  };

  const importValorantAgents = async () => {
    try {
      const response = await fetch("/api/admin/valorant-agents", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to import Valorant agents");
      }

      toast.success("Valorant agents imported successfully");
      fetchData();
    } catch (error) {
      console.error("Error importing Valorant agents:", error);
      toast.error("Failed to import Valorant agents");
    }
  };

  const importDemonSlayerCharacters = async () => {
    try {
      const response = await fetch("/api/admin/demon-slayer", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to import Demon Slayer characters");
      }

      toast.success("Demon Slayer characters imported successfully");
      fetchData();
    } catch (error) {
      console.error("Error importing Demon Slayer characters:", error);
      toast.error("Failed to import Demon Slayer characters");
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Characters</h2>
        <div className="space-x-2">
          <button
            onClick={importDemonSlayerCharacters}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Import Demon Slayer
          </button>
          <button
            onClick={importValorantAgents}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Import Valorant Agents
          </button>
          <button
            onClick={() => setIsBulkDialogOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Bulk Create
          </button>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Add New Character
          </button>
        </div>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">
              {editingCharacter ? "Edit Character" : "Add New Character"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Character Image
                </label>
                <div className="mt-1 flex items-center space-x-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) handleLocalFileSelect(file);
                    }}
                    className="hidden"
                    accept="image/*"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Select Image
                  </button>
                  {(localPreview || formData.characterImage) && (
                    <img
                      src={localPreview || formData.characterImage}
                      alt="Preview"
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryId: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                    setLocalPreview(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingFile}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {uploadingFile
                    ? "Uploading..."
                    : editingCharacter
                    ? "Update"
                    : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isBulkDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
          <div className="bg-white p-6 rounded-lg w-full max-w-4xl my-8">
            <h3 className="text-lg font-medium mb-4">Bulk Create Characters</h3>
            <form onSubmit={handleBulkSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Common Category
                </label>
                <select
                  value={bulkCategoryId}
                  onChange={(e) => setBulkCategoryId(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Upload Images
                </label>
                <div className="mt-1">
                  <input
                    type="file"
                    ref={bulkFileInputRef}
                    onChange={handleBulkFileSelect}
                    className="hidden"
                    accept="image/*"
                    multiple
                  />
                  <button
                    type="button"
                    onClick={() => bulkFileInputRef.current?.click()}
                    disabled={bulkUploading}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Select Images
                  </button>
                </div>
              </div>

              {bulkCharacters.length > 0 && (
                <div className="mt-4 space-y-4">
                  <h4 className="font-medium">
                    Selected Images ({bulkCharacters.length})
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {bulkCharacters.map((char, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-4 p-4 border rounded-lg"
                      >
                        <div className="relative group">
                          <img
                            src={char.preview}
                            alt={`Character ${index + 1}`}
                            className="w-24 h-24 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => removeBulkCharacter(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700">
                            Character Name
                          </label>
                          <input
                            type="text"
                            value={char.name}
                            onChange={(e) =>
                              updateBulkCharacterName(index, e.target.value)
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="Enter character name"
                            required
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsBulkDialogOpen(false);
                    setBulkCharacters([]);
                    setBulkCategoryId("");
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bulkUploading || bulkCharacters.length === 0}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {bulkUploading ? "Creating..." : "Create All Characters"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {characters.map((character) => (
              <tr key={character.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {character.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {character.category.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {character.characterImage && (
                    <img
                      src={character.characterImage}
                      alt={character.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(character)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(character.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
