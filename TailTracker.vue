<template>
  <div class="tail-tracker">
    <h1>TailTracker 🐾</h1>

    <!-- Form -->
    <div class="form-container">
      <input v-model="petForm.name" type="text" placeholder="Pet Name" class="input-field" />

   <!-- HIDDEN FILE INPUT -->
<input 
  type="file" 
  ref="fileInput"
  id="fileInput"
  @change="onImageSelected"
  accept=".png, .jpg, .jpeg"
  class="file-input-hidden"
/>

<!-- CUSTOM FILE UPLOAD BUTTON -->
<label for="fileInput" class="btn-upload">Upload Image</label>

<span class="file-name">{{ petForm.image ? "Image Selected" : "No file chosen" }}</span>


      <div class="buttons">
        <button @click="addPet" class="btn-primary">Add Pet</button>
      </div>
    </div>

   <!-- Pet List -->
    <div class="pet-list">
    <div v-for="(pet, index) in pets" :key="pet.pet_id" class="pet-item">
        <img v-if="pet.image" :src="pet.image" alt="Pet Image" class="pet-image" />
        <div class="pet-info">
        <h3>{{ pet.name }}</h3>
        <p v-if="pet.is_favorite" class="pet-favorite">★ Favorite</p>
        </div>
        <div class="item-buttons">
        <button @click="toggleFavorite(index)" class="btn-favorite">
            {{ pet.is_favorite ? "Unfavorite" : "Favorite" }}
        </button>
        <button @click="deletePet(index)" class="btn-delete">Delete</button>
        </div>
    </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "TailTracker",
  data() {
    return {
      pets: [],
      petForm: { name: "", image: null, is_favorite: false },
    };
  },
  methods: {
    onImageSelected(e) {
      const file = e.target.files[0];
      if (!file) return;

      const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
      if (!allowedTypes.includes(file.type)) {
        alert("Only PNG, JPG, or JPEG files are allowed!");
        e.target.value = null;
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        this.petForm.image = event.target.result;
      };
      reader.readAsDataURL(file);
    },
    addPet() {
      if (!this.petForm.name) {
        alert("Pet name is required!");
        return;
      }

      this.pets.push({
        pet_id: Date.now(),
        name: this.petForm.name,
        image: this.petForm.image,
        is_favorite: false,
      });

      this.resetForm();
    },
    toggleFavorite(index) {
      this.pets[index].is_favorite = !this.pets[index].is_favorite;
    },
    deletePet(index) {
      if (confirm("Are you sure you want to delete this pet?")) {
        this.pets.splice(index, 1);
      }
    },
    resetForm() {
      this.petForm = { name: "", image: null, is_favorite: false };
      if (this.$refs.fileInput) this.$refs.fileInput.value = null;
    },
  },
};
</script>

<style scoped>
.tail-tracker { max-width: 480px; margin: 30px auto; text-align: center; font-family: sans-serif; }
h1 { color: #6b5b95; margin-bottom: 20px; }

.form-container {
  background: #f8f6f9;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: center;
}

/* hide ugly native file input */
.file-input-hidden {
  display: none;
}

/* beautiful custom upload button */
.btn-upload {
  background: #6b5b95;
  color: white;
  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
}

.btn-upload:hover {
  background: #584878;
}

/* filename text */
.file-name {
  font-size: 0.9rem;
  color: #666;
}

.input-field {
  flex: 1;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.btn-primary {
  background: #6b5b95;
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
}

.pet-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pet-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.pet-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #6b5b95;
  margin-right: 12px;
}

.pet-info {
  flex: 1;
  text-align: left;
}

.pet-favorite {
  color: #f59ca9;
  font-weight: bold;
  margin: 2px 0 0 0;
}

.item-buttons {
  display: flex;
  gap: 6px;
}

.btn-favorite {
  background: #6b5b95;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
}

.btn-favorite:hover {
  background: #584878;
}

.btn-delete {
  background: #f59ca9;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
}

.btn-delete:hover {
  background: #e0557a;
}


@media(max-width: 480px){
  .pet-card { width: 100%; max-width: 220px; }
  .form-container {
    flex-direction: column;
    align-items: stretch;
  }

  .file-input,
  .input-field,
  .btn-primary {
    width: 100%;
  }
    .card-buttons { flex-direction: column; }
  h1 { font-size: 1.6rem; }
}
</style>
