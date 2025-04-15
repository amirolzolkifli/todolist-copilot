<?php
header('Content-Type: application/json');
require_once 'config.php';

$action = $_POST['action'] ?? $_GET['action'] ?? '';

switch ($action) {
    case 'get':
        $filter = $_GET['filter'] ?? 'all';
        $query = "SELECT * FROM todos";
        if ($filter === 'active') {
            $query .= " WHERE completed = 0";
        } elseif ($filter === 'completed') {
            $query .= " WHERE completed = 1";
        }
        $query .= " ORDER BY position ASC";
        
        $stmt = $db->query($query);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;

    case 'add':
        $task = $_POST['task'] ?? '';
        if (!empty($task)) {
            $position = $db->query("SELECT COALESCE(MAX(position), 0) + 1 FROM todos")->fetchColumn();
            $stmt = $db->prepare("INSERT INTO todos (task, position) VALUES (?, ?)");
            $stmt->execute([$task, $position]);
            echo json_encode(['success' => true, 'id' => $db->lastInsertId()]);
        }
        break;

    case 'update':
        $id = $_POST['id'] ?? 0;
        $completed = $_POST['completed'] ?? null;
        if ($id && isset($completed)) {
            $stmt = $db->prepare("UPDATE todos SET completed = ? WHERE id = ?");
            $stmt->execute([$completed, $id]);
            echo json_encode(['success' => true]);
        }
        break;

    case 'updateAll':
        $completed = $_POST['completed'] ?? null;
        if (isset($completed)) {
            $stmt = $db->prepare("UPDATE todos SET completed = ?");
            $stmt->execute([$completed]);
            echo json_encode(['success' => true]);
        }
        break;

    case 'delete':
        $ids = json_decode($_POST['ids'] ?? '[]');
        if (!empty($ids)) {
            try {
                $placeholders = str_repeat('?,', count($ids) - 1) . '?';
                $stmt = $db->prepare("DELETE FROM todos WHERE id IN ($placeholders)");
                $stmt->execute($ids);
                echo json_encode(['success' => true]);
            } catch (Exception $e) {
                echo json_encode(['success' => false, 'error' => $e->getMessage()]);
            }
        } else {
            echo json_encode(['success' => false, 'error' => 'No items selected']);
        }
        break;

    case 'updatePositions':
        $positions = json_decode($_POST['positions'] ?? '[]', true);
        if (!empty($positions)) {
            $db->beginTransaction();
            try {
                $stmt = $db->prepare("UPDATE todos SET position = ? WHERE id = ?");
                foreach ($positions as $position) {
                    if (!isset($position['id']) || !isset($position['position'])) {
                        throw new Exception('Invalid position data');
                    }
                    $stmt->execute([$position['position'], $position['id']]);
                }
                $db->commit();
                echo json_encode(['success' => true]);
            } catch (Exception $e) {
                $db->rollBack();
                echo json_encode(['success' => false, 'error' => $e->getMessage()]);
            }
        } else {
            echo json_encode(['success' => false, 'error' => 'No position data provided']);
        }
        break;
}
?>