/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 96.56652360515021, "KoPercent": 3.4334763948497855};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7905982905982906, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=39c44e15-5b1e-4e9a-8e11-5a08a90f5e16"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=44fa59e1-28a4-4eaf-88f6-4ae428678f0a"], "isController": false}, {"data": [0.3644067796610169, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d45a6f7c-4e24-4ae1-a1eb-bd295cc167fc"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f78994ad-8525-4a8a-b34d-a5498ef9bf34"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6619a234-5caa-4103-b764-db8d82a47c02"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/924cbb64-912f-46f8-9b3a-69e436a1faa1"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6111111111111112, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cd765558-434a-4ee7-ac64-caabf93bdca2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ee5eda72-57d7-485d-97e7-e69f1d308f67"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0f42785f-b32e-4ae9-be74-0ebd43b0d8f3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1c92d9c6-771c-46f4-a34f-ad19beb00538"], "isController": false}, {"data": [0.7391304347826086, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8bd2f927-5b4f-47cd-bb7d-d3f2312cd2b4"], "isController": false}, {"data": [0.021739130434782608, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6619a234-5caa-4103-b764-db8d82a47c02"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/038c5da5-f36a-4afd-bfbf-b07adf1b538e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0da9df3f-8850-45f2-bf06-d7f36fb0c346"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1cd899e0-646e-427c-9cfe-36bd2fdea829"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.23076923076923078, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4915254237288136, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.23076923076923078, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5882352941176471, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/39c44e15-5b1e-4e9a-8e11-5a08a90f5e16"], "isController": false}, {"data": [0.41304347826086957, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0f42785f-b32e-4ae9-be74-0ebd43b0d8f3"], "isController": false}, {"data": [0.29508196721311475, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=924cbb64-912f-46f8-9b3a-69e436a1faa1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f78994ad-8525-4a8a-b34d-a5498ef9bf34"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8305084745762712, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ee5eda72-57d7-485d-97e7-e69f1d308f67"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8867403314917127, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cd765558-434a-4ee7-ac64-caabf93bdca2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0da9df3f-8850-45f2-bf06-d7f36fb0c346"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8bd2f927-5b4f-47cd-bb7d-d3f2312cd2b4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1cd899e0-646e-427c-9cfe-36bd2fdea829"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/1c92d9c6-771c-46f4-a34f-ad19beb00538"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=038c5da5-f36a-4afd-bfbf-b07adf1b538e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/44fa59e1-28a4-4eaf-88f6-4ae428678f0a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1398, 48, 3.4334763948497855, 305.049356223176, 81, 2484, 97.0, 826.3000000000004, 1058.0, 1465.09, 5.463968294913585, 770.3422429079313, 4.000689438819579], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=39c44e15-5b1e-4e9a-8e11-5a08a90f5e16", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 0.7465457128099173, 2.848979855371901], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=44fa59e1-28a4-4eaf-88f6-4ae428678f0a", 1, 0, 0.0, 311.0, 311, 311, 311.0, 311.0, 311.0, 311.0, 3.215434083601286, 0.580913384244373, 2.216891077170418], "isController": false}, {"data": ["see books", 59, 0, 0.0, 1379.7457627118645, 989, 1895, 1367.0, 1729.0, 1814.0, 1895.0, 0.2569328316610925, 309.17736891254265, 1.2633367259898447], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d45a6f7c-4e24-4ae1-a1eb-bd295cc167fc", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 1.6376201923076923, 3.059895833333333], "isController": false}, {"data": ["deleteBook", 18, 5, 27.77777777777778, 463.38888888888897, 84, 1268, 432.0, 888.2000000000006, 1268.0, 1268.0, 0.08568286866244282, 0.01819924212312628, 0.05709866947595406], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 18, 5, 27.77777777777778, 463.38888888888897, 84, 1268, 432.0, 888.2000000000006, 1268.0, 1268.0, 0.08624613689178506, 0.018318881615198485, 0.0574740288325627], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 120.72222222222221, 82, 254, 84.0, 248.60000000000002, 254.0, 254.0, 0.08603137277393823, 0.02302011341802644, 0.049064767285136646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 95.55555555555557, 83, 250, 85.0, 109.60000000000022, 250.0, 250.0, 0.08603137277393823, 0.06393542449313183, 0.04318371641191821], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 120.50000000000001, 81, 250, 83.0, 249.1, 250.0, 250.0, 0.08603219515925514, 0.02318836510151799, 0.0506615367978817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 111.5, 81, 249, 84.0, 249.0, 249.0, 249.0, 0.0860326063578096, 0.02318847593237837, 0.050577762722071665], "isController": false}, {"data": ["goToProfile", 18, 5, 27.77777777777778, 212.0, 83, 543, 196.5, 424.20000000000016, 543.0, 543.0, 0.08571877574539619, 0.1308755309801942, 0.05539259645743348], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 96.1875, 83, 250, 84.0, 144.30000000000013, 250.0, 250.0, 0.09096594462448121, 0.0676026209562795, 0.0456606401728353], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f78994ad-8525-4a8a-b34d-a5498ef9bf34", 1, 0, 0.0, 394.0, 394, 394, 394.0, 394.0, 394.0, 394.0, 2.5380710659898473, 0.45853822969543145, 1.7498810279187818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 114.25, 81, 249, 83.5, 248.3, 249.0, 249.0, 0.09097059943939367, 0.041420939442009086, 0.05092665637561761], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 545.7777777777778, 487, 658, 498.0, 658.0, 658.0, 658.0, 0.04551822499152856, 13.383869494823566, 0.025959612690481127], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 866.4444444444445, 728, 1062, 886.0, 1062.0, 1062.0, 1062.0, 0.04542930695068396, 40.87737025042905, 0.02586453706274292], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6619a234-5caa-4103-b764-db8d82a47c02", 3, 0, 0.0, 566.0, 169, 986, 543.0, 986.0, 986.0, 986.0, 0.025705619248367693, 0.025780928679759396, 0.01648439776018371], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 142.88888888888889, 82, 258, 91.0, 258.0, 258.0, 258.0, 0.0456141951375268, 0.08071574373945173, 0.025257078752907905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 106.37499999999997, 83, 251, 85.0, 248.9, 251.0, 251.0, 0.09011190772540648, 0.06696793142483823, 0.04523195368247943], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 129.1875, 81, 335, 83.0, 272.70000000000005, 335.0, 335.0, 0.09011190772540648, 0.04102995798532302, 0.0504459483433489], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 210.37500000000003, 82, 771, 84.5, 770.3, 771.0, 771.0, 0.09011190772540648, 10.156608599632795, 0.05200794674386254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 169.87500000000003, 82, 732, 83.0, 676.7, 732.0, 732.0, 0.09011241523800942, 3.333257359649913, 0.05209624005947419], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 84.33333333333333, 83, 87, 84.0, 87.0, 87.0, 87.0, 0.04561303924748621, 0.0338979715501338, 0.02561279059307087], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/924cbb64-912f-46f8-9b3a-69e436a1faa1", 3, 0, 0.0, 271.0, 183, 400, 230.0, 400.0, 400.0, 400.0, 0.03398586188145731, 0.028332614673962298, 0.021794318979970997], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 504.94736842105266, 81, 1054, 251.0, 1047.0, 1054.0, 1054.0, 0.09093780811165247, 38.77258432238171, 0.04975965795418649], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 185.81250000000003, 83, 896, 85.0, 781.9000000000001, 896.0, 896.0, 0.09097008221421181, 10.253334355562252, 0.05250324080917888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 368.8947368421052, 82, 737, 259.0, 680.0, 737.0, 737.0, 0.09093780811165247, 12.678616886792001, 0.04984846440742052], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 144.00000000000003, 82, 685, 84.0, 515.6000000000001, 685.0, 685.0, 0.09097111667045713, 3.365020717250398, 0.05259267682510803], "isController": false}, {"data": ["deleteBooks", 18, 5, 27.77777777777778, 390.2222222222222, 87, 1433, 381.5, 742.7000000000011, 1433.0, 1433.0, 0.08654095791224747, 0.01838150229093147, 0.057952205051588025], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/cd765558-434a-4ee7-ac64-caabf93bdca2", 3, 0, 0.0, 278.6666666666667, 212, 380, 244.0, 380.0, 380.0, 380.0, 0.03427200548352088, 0.028236473267835724, 0.021977816016450564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 318.06249999999994, 167, 859, 173.5, 856.2, 859.0, 859.0, 0.09006879003839183, 13.59133863683701, 0.19968620174283108], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ee5eda72-57d7-485d-97e7-e69f1d308f67", 3, 0, 0.0, 336.0, 170, 608, 230.0, 608.0, 608.0, 608.0, 0.028902569438423075, 0.028987244934824706, 0.018534525323467922], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0f42785f-b32e-4ae9-be74-0ebd43b0d8f3", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1c92d9c6-771c-46f4-a34f-ad19beb00538", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.3664585446247465, 1.3984850405679514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 564.8695652173914, 93, 1816, 431.0, 1022.4000000000003, 1673.599999999998, 1816.0, 0.09910290328418404, 0.06087473258374196, 0.04480922287165743], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 112.31578947368419, 83, 250, 85.0, 248.0, 250.0, 250.0, 0.09093650239067279, 0.06758074054619334, 0.045645861551568176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 157.21052631578948, 82, 288, 85.0, 265.0, 288.0, 288.0, 0.09093780811165247, 0.08903080637904794, 0.04824527422535346], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8bd2f927-5b4f-47cd-bb7d-d3f2312cd2b4", 1, 0, 0.0, 1433.0, 1433, 1433, 1433.0, 1433.0, 1433.0, 1433.0, 0.6978367062107467, 0.12607401430565246, 0.48112569783670617], "isController": false}, {"data": ["login", 23, 0, 0.0, 2493.8695652173915, 1446, 3649, 2566.0, 3414.0, 3612.3999999999996, 3649.0, 0.09976836388558738, 46.83748096132241, 0.21526532555935352], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 107.87500000000001, 84, 254, 87.0, 250.5, 254.0, 254.0, 0.09463591787968226, 0.07661442961157872, 0.03364011143379331], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6619a234-5caa-4103-b764-db8d82a47c02", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 630.0000000000001, 168, 1139, 508.0, 1133.0, 1139.0, 1139.0, 0.09089995742054625, 51.58633320635248, 0.1934193738308591], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/038c5da5-f36a-4afd-bfbf-b07adf1b538e", 3, 0, 0.0, 302.3333333333333, 188, 428, 291.0, 428.0, 428.0, 428.0, 0.048462134918583616, 0.03992762483038253, 0.031077606051305245], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0da9df3f-8850-45f2-bf06-d7f36fb0c346", 3, 0, 0.0, 565.0, 190, 1160, 345.0, 1160.0, 1160.0, 1160.0, 0.059051630809204184, 0.02775734208609728, 0.03786839605928784], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1cd899e0-646e-427c-9cfe-36bd2fdea829", 1, 0, 0.0, 666.0, 666, 666, 666.0, 666.0, 666.0, 666.0, 1.5015015015015014, 0.2712673611111111, 1.0352149024024024], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 18, 9, 50.0, 517.8333333333331, 83, 1149, 449.5, 1069.8000000000002, 1149.0, 1149.0, 0.08728288382648162, 52.222014243475606, 0.1272401849184875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 254.83333333333334, 168, 499, 179.5, 360.4000000000002, 499.0, 499.0, 0.08599643592548888, 0.13327767950561603, 0.19340799993789146], "isController": false}, {"data": ["register", 26, 10, 38.46153846153846, 1036.384615384615, 210, 2484, 1041.5, 1797.6000000000001, 2266.2999999999993, 2484.0, 0.10237631169649362, 0.031808024727816825, 0.04618931250369145], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 106.21052631578947, 85, 257, 87.0, 250.0, 257.0, 257.0, 0.09264586848187555, 0.07192721234676862, 0.0329327110619167], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 303.68749999999994, 167, 984, 172.5, 981.2, 984.0, 984.0, 0.09092200596675663, 13.720088524648387, 0.20157781645120046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 317.9285714285715, 168, 1065, 331.0, 701.0, 1065.0, 1065.0, 0.11339521472193874, 9.853194644404756, 0.25295612212664625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 100.27272727272728, 83, 246, 85.0, 214.80000000000013, 246.0, 246.0, 0.05881189283403818, 0.043706885201858454, 0.029520813395210573], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 115.0909090909091, 82, 258, 84.0, 257.6, 258.0, 258.0, 0.05881189283403818, 0.015736776012232872, 0.0335411576319124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 130.54545454545453, 83, 273, 84.0, 267.8, 273.0, 273.0, 0.05881189283403818, 0.015851642990424353, 0.03457496043563573], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 83.81818181818181, 81, 89, 84.0, 88.2, 89.0, 89.0, 0.0588122072756047, 0.015851727742252828, 0.03463257908905237], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, 100.0, 98.6, 87, 129, 89.0, 129.0, 129.0, 129.0, 0.055739495891999155, 0.016438796640023186, 0.03445615322230026], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 950.864406779661, 650, 1529, 890.0, 1383.0, 1424.0, 1529.0, 0.26434639234381163, 316.25018691866194, 0.5219808645695186], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 10, 38.46153846153846, 1036.384615384615, 210, 2484, 1041.5, 1797.6000000000001, 2266.2999999999993, 2484.0, 0.10194399353831919, 0.03167370472314364, 0.04599426270967135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 129.7142857142857, 82, 246, 84.0, 246.0, 246.0, 246.0, 0.03749250149970006, 0.010105400794841032, 0.022078103910467904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 152.71428571428572, 82, 247, 84.0, 247.0, 247.0, 247.0, 0.037459396689659606, 0.010096478014009815, 0.022022028132006915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 110.47368421052632, 82, 256, 83.0, 250.0, 256.0, 256.0, 0.08976830328457497, 0.024195362994670597, 0.05277394392315833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 107.42105263157895, 81, 341, 85.0, 249.0, 341.0, 341.0, 0.08976915153977719, 0.02419559162595557, 0.052862107791489886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 84.94736842105262, 82, 89, 84.0, 88.0, 89.0, 89.0, 0.0897678791629854, 0.06671226176077333, 0.0450592674704829], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 145.14285714285714, 81, 336, 87.0, 336.0, 336.0, 336.0, 0.03745739221635389, 0.01002277877664157, 0.021362418998389334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 115.21052631578948, 82, 338, 84.0, 250.0, 338.0, 338.0, 0.08976872741017222, 0.02402014776404999, 0.05119622735111384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 108.57142857142857, 84, 248, 86.0, 248.0, 248.0, 248.0, 0.03749169826681235, 0.027862482793988473, 0.01881907510658354], "isController": false}, {"data": ["deleteAccount", 17, 4, 23.529411764705884, 459.64705882352945, 83, 1160, 423.0, 1002.3999999999999, 1160.0, 1160.0, 0.08383428427712655, 0.01686028430918084, 0.057043721120321925], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 88.42857142857143, 83, 93, 88.0, 93.0, 93.0, 93.0, 0.03898570338562987, 0.030686012625798512, 0.013858199250360618], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/39c44e15-5b1e-4e9a-8e11-5a08a90f5e16", 3, 0, 0.0, 403.3333333333333, 261, 543, 406.0, 543.0, 543.0, 543.0, 0.07974693638852708, 0.03608341197267338, 0.0511397997022781], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1296.4782608695655, 897, 1993, 1197.0, 1839.4000000000005, 1985.8, 1993.0, 0.10274967053094776, 0.0531809818177757, 0.047260834785230854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 301.1428571428571, 169, 495, 334.0, 495.0, 495.0, 495.0, 0.03744016259727757, 0.058024939494022945, 0.08420380318508812], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f42785f-b32e-4ae9-be74-0ebd43b0d8f3", 3, 0, 0.0, 449.3333333333333, 289, 629, 430.0, 629.0, 629.0, 629.0, 0.040529586598216705, 0.033787848723318026, 0.025990652864090788], "isController": false}, {"data": ["addBook", 61, 19, 31.147540983606557, 840.2295081967213, 428, 1634, 696.0, 1509.4, 1549.6, 1634.0, 0.27841676707927115, 77.5557887224664, 1.0123630166684923], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=924cbb64-912f-46f8-9b3a-69e436a1faa1", 1, 0, 0.0, 615.0, 615, 615, 615.0, 615.0, 615.0, 615.0, 1.6260162601626016, 0.2937627032520325, 1.1210619918699187], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f78994ad-8525-4a8a-b34d-a5498ef9bf34", 3, 0, 0.0, 501.66666666666663, 174, 963, 368.0, 963.0, 963.0, 963.0, 0.049896879781784316, 0.0310393675986295, 0.03199767355798017], "isController": false}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 154.9322033898305, 82, 355, 86.0, 339.0, 351.0, 355.0, 0.2650196518809657, 0.19695308113419427, 0.12811008562605278], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 521.5254237288136, 405, 754, 490.0, 666.0, 744.0, 754.0, 0.2649042303858622, 77.89063938171802, 0.13322820180538966], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ee5eda72-57d7-485d-97e7-e69f1d308f67", 1, 0, 0.0, 527.0, 527, 527, 527.0, 527.0, 527.0, 527.0, 1.8975332068311195, 0.34281605787476277, 1.3082601992409866], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 136.98305084745766, 82, 257, 88.0, 253.0, 255.0, 257.0, 0.265385618798298, 0.4696081457641756, 0.129064490392141], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 794.3389830508477, 567, 1220, 751.0, 1059.0, 1093.0, 1220.0, 0.2648091130241201, 238.27570538387224, 0.13292176181093526], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 90.71428571428571, 84, 109, 88.5, 104.5, 109.0, 109.0, 0.11695027107402116, 0.0873700755582287, 0.04157216667084346], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 19, 10.497237569060774, 138.8011049723756, 84, 978, 91.0, 237.80000000000007, 312.5, 964.0600000000002, 0.7654215527485401, 1.6776138776002132, 0.3655765070029729], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 88.63636363636364, 83, 102, 87.0, 100.2, 102.0, 102.0, 0.06047810692529304, 0.046835096476325576, 0.021498077071100262], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cd765558-434a-4ee7-ac64-caabf93bdca2", 1, 0, 0.0, 382.0, 382, 382, 382.0, 382.0, 382.0, 382.0, 2.617801047120419, 0.47294257198952877, 1.804851112565445], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 97.99999999999999, 84, 252, 87.0, 126.0000000000002, 252.0, 252.0, 0.08987238121866949, 0.0729335437428851, 0.03194682301132392], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0da9df3f-8850-45f2-bf06-d7f36fb0c346", 1, 0, 0.0, 217.0, 217, 217, 217.0, 217.0, 217.0, 217.0, 4.608294930875576, 0.8325532834101382, 3.1772033410138247], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8bd2f927-5b4f-47cd-bb7d-d3f2312cd2b4", 3, 0, 0.0, 427.6666666666667, 411, 447, 425.0, 447.0, 447.0, 447.0, 0.025674160668897467, 0.025749377936482125, 0.016464224126864584], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1cd899e0-646e-427c-9cfe-36bd2fdea829", 3, 0, 0.0, 346.0, 217, 423, 398.0, 423.0, 423.0, 423.0, 0.01715452221796536, 0.023648893747748468, 0.011000784104619713], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 249.18181818181822, 168, 503, 175.0, 474.2000000000001, 503.0, 503.0, 0.05878517758467738, 0.09110554377625292, 0.13220924216553906], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1c92d9c6-771c-46f4-a34f-ad19beb00538", 3, 0, 0.0, 824.0, 296, 1508, 668.0, 1508.0, 1508.0, 1508.0, 0.022308149910767402, 0.026367477970701964, 0.014305682071683522], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 216.1578947368421, 167, 426, 173.0, 426.0, 426.0, 426.0, 0.08973226725102838, 0.1390674884056465, 0.2018099721475765], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 88.4375, 84, 100, 87.0, 95.80000000000001, 100.0, 100.0, 0.08811397542721511, 0.07305543470479064, 0.03132176470264287], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 91.36842105263159, 85, 130, 88.0, 100.0, 130.0, 130.0, 0.09115988964855463, 0.07077354713925872, 0.03240449202350965], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=038c5da5-f36a-4afd-bfbf-b07adf1b538e", 1, 0, 0.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 381.0, 2.6246719160104988, 0.47418389107611547, 1.8095882545931758], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/44fa59e1-28a4-4eaf-88f6-4ae428678f0a", 3, 0, 0.0, 283.0, 203, 423, 223.0, 423.0, 423.0, 423.0, 0.07714065312419645, 0.03490413666752378, 0.04946845268706608], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 85.57142857142857, 82, 93, 85.0, 90.5, 93.0, 93.0, 0.11347885645735221, 0.08433340797270024, 0.05696106662019437], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 107.85714285714285, 81, 253, 83.5, 250.0, 253.0, 253.0, 0.11347977628272675, 0.0425390846640188, 0.06403818290508227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 218.2142857142857, 83, 978, 167.5, 614.5, 978.0, 978.0, 0.11347333781823193, 7.321507769377599, 0.06601336756445692], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 172.14285714285714, 82, 650, 88.5, 450.0, 650.0, 650.0, 0.11347885645735221, 2.411726494678652, 0.06612739724084267], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 20.833333333333332, 0.7153075822603719], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 5, 10.416666666666666, 0.35765379113018597], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 8.333333333333334, 0.2861230329041488], "isController": false}, {"data": ["401/Unauthorized", 29, 60.416666666666664, 2.0743919885550786], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1398, 48, "401/Unauthorized", 29, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 18, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 18, 9, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 19, "401/Unauthorized", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
