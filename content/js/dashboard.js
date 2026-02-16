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

    var data = {"OkPercent": 68.60282574568289, "KoPercent": 31.39717425431711};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5086705202312138, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/81c1a9b1-f6ef-45e4-9e99-4e64af3bfb8c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f66647af-c1cd-46cf-bbc8-89444632ce63"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f9c601bc-68b1-468e-9ad5-29b7cb5f335b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1b7920c4-dd06-4b42-9da4-07d9bd375429"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=81ca7ee5-bbed-4dd7-abee-4186d9427654"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ddebd038-94a4-41a6-9b5e-66aa71e7967e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/de09ab62-a595-4ac3-80f1-2c2d14af7f52"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1b7920c4-dd06-4b42-9da4-07d9bd375429"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3384b11c-be58-4adb-878e-c8cfafa0c715"], "isController": false}, {"data": [0.7, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ddebd038-94a4-41a6-9b5e-66aa71e7967e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/81ca7ee5-bbed-4dd7-abee-4186d9427654"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/192efa56-f485-4048-89b3-d756046b4211"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e8c543e-ac0b-4ee7-8472-fb2601584038"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f48bad05-5736-4b53-8428-642b5f322419"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=81c1a9b1-f6ef-45e4-9e99-4e64af3bfb8c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f48bad05-5736-4b53-8428-642b5f322419"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7e8c543e-ac0b-4ee7-8472-fb2601584038"], "isController": false}, {"data": [0.6, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f9c601bc-68b1-468e-9ad5-29b7cb5f335b"], "isController": false}, {"data": [0.43478260869565216, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8df0af01-5ec4-4443-82f7-3db7c3e68789"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/966239ea-04ec-40fb-909b-a3bfec535375"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6491cd28-55b0-4ee8-a026-7706d9483bae"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3384b11c-be58-4adb-878e-c8cfafa0c715"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dffea2c7-755c-46c3-9455-cebb7c8e1a1c"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6491cd28-55b0-4ee8-a026-7706d9483bae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7f657188-41f9-4cbf-ab1d-a9e2d842b34e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5a413032-13eb-4810-8aea-b475bcfbb7de"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9423076923076923, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/dffea2c7-755c-46c3-9455-cebb7c8e1a1c"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7f657188-41f9-4cbf-ab1d-a9e2d842b34e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.717391304347826, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.043478260869565216, 500, 1500, "login"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8df0af01-5ec4-4443-82f7-3db7c3e68789"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3b1a68ed-877f-4bc7-a269-dcc3479a235e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=192efa56-f485-4048-89b3-d756046b4211"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=de09ab62-a595-4ac3-80f1-2c2d14af7f52"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a3861b4d-37b3-43b6-8e01-b891d50c796e"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.375, 500, 1500, "register"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 637, 200, 31.39717425431711, 313.5792778649922, 137, 1925, 153.0, 679.2000000000003, 1015.3000000000001, 1515.7000000000003, 2.490382510243018, 2.609532114987646, 1.1943862118525788], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/81c1a9b1-f6ef-45e4-9e99-4e64af3bfb8c", 3, 0, 0.0, 324.0, 226, 403, 343.0, 403.0, 403.0, 403.0, 0.029000357671077944, 0.02417640494649434, 0.018597234574226414], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f66647af-c1cd-46cf-bbc8-89444632ce63", 1, 0, 0.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 1.247406005859375, 2.330780029296875], "isController": false}, {"data": ["see books", 60, 60, 100.0, 781.4333333333333, 560, 1069, 850.0, 1026.7, 1035.7, 1069.0, 0.2605195628481735, 1.6749152090235293, 0.4373370395859476], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 175.5, 141, 417, 150.0, 389.00000000000057, 416.9, 417.0, 0.08707729416016127, 0.06760395396223458, 0.030953256908494823], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 16, 100.0, 216.99999999999997, 140, 447, 148.0, 437.2, 447.0, 447.0, 0.08251080375836711, 0.041013671008797714, 0.04141655579277412], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f9c601bc-68b1-468e-9ad5-29b7cb5f335b", 3, 0, 0.0, 349.6666666666667, 241, 501, 307.0, 501.0, 501.0, 501.0, 0.054234836843532495, 0.03550333883214318, 0.03477950149145802], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1b7920c4-dd06-4b42-9da4-07d9bd375429", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 19, 100.0, 162.21052631578948, 139, 433, 149.0, 158.0, 433.0, 433.0, 0.08660100183685283, 0.04304678704585751, 0.043469643500139016], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=81ca7ee5-bbed-4dd7-abee-4186d9427654", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ddebd038-94a4-41a6-9b5e-66aa71e7967e", 3, 0, 0.0, 340.3333333333333, 241, 537, 243.0, 537.0, 537.0, 537.0, 0.07404116688879017, 0.03350169986178982, 0.047480826422824425], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de09ab62-a595-4ac3-80f1-2c2d14af7f52", 3, 0, 0.0, 323.6666666666667, 225, 431, 315.0, 431.0, 431.0, 431.0, 0.025707822033317337, 0.02578313791818057, 0.01648581035339686], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1b7920c4-dd06-4b42-9da4-07d9bd375429", 3, 0, 0.0, 713.6666666666667, 272, 1552, 317.0, 1552.0, 1552.0, 1552.0, 0.02759914994618166, 0.02768000683078961, 0.01769867363085217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 147.0, 147, 147, 147.0, 147.0, 147.0, 147.0, 6.802721088435374, 2.0062712585034013, 4.205197704081633], "isController": false}, {"data": ["https://demoqa.com/books", 60, 60, 100.0, 267.4833333333334, 138, 603, 146.5, 579.9, 583.95, 603.0, 0.2618075191119489, 0.13013674533982617, 0.1265573456644675], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3384b11c-be58-4adb-878e-c8cfafa0c715", 3, 0, 0.0, 332.3333333333333, 229, 426, 342.0, 426.0, 426.0, 426.0, 0.034489894460922946, 0.02875280589662229, 0.022117542997401762], "isController": false}, {"data": ["deleteBook", 15, 1, 6.666666666666667, 606.2, 144, 1212, 497.0, 1143.0, 1212.0, 1212.0, 0.08214496944207136, 0.015466357527764998, 0.05557085790837002], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, 6.666666666666667, 606.2, 144, 1212, 497.0, 1143.0, 1212.0, 1212.0, 0.08260048348816336, 0.015552122281755756, 0.05587901197431675], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 4, 16.666666666666668, 948.4583333333333, 201, 1846, 970.0, 1496.5, 1774.0, 1846.0, 0.09539784877851006, 0.03037079951347097, 0.043040826304366835], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ddebd038-94a4-41a6-9b5e-66aa71e7967e", 1, 0, 0.0, 537.0, 537, 537, 537.0, 537.0, 537.0, 537.0, 1.86219739292365, 0.33643214618249534, 1.2838978119180633], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/81ca7ee5-bbed-4dd7-abee-4186d9427654", 3, 0, 0.0, 348.3333333333333, 239, 528, 278.0, 528.0, 528.0, 528.0, 0.021851555102338115, 0.021915573330176998, 0.014012878760288441], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/192efa56-f485-4048-89b3-d756046b4211", 3, 0, 0.0, 346.3333333333333, 257, 503, 279.0, 503.0, 503.0, 503.0, 0.023590840463009563, 0.03232989529598641, 0.015128240791708604], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e8c543e-ac0b-4ee7-8472-fb2601584038", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 0.7820955086580086, 2.9846455627705626], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f48bad05-5736-4b53-8428-642b5f322419", 3, 0, 0.0, 549.6666666666667, 239, 1089, 321.0, 1089.0, 1089.0, 1089.0, 0.01820333120961136, 0.025094761612208367, 0.011673360183246866], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=81c1a9b1-f6ef-45e4-9e99-4e64af3bfb8c", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f48bad05-5736-4b53-8428-642b5f322419", 1, 0, 0.0, 749.0, 749, 749, 749.0, 749.0, 749.0, 749.0, 1.335113484646195, 0.24120702603471295, 0.9204981642189586], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e8c543e-ac0b-4ee7-8472-fb2601584038", 3, 0, 0.0, 302.6666666666667, 214, 472, 222.0, 472.0, 472.0, 472.0, 0.0774493352265393, 0.03504380728023751, 0.04966640312378986], "isController": false}, {"data": ["deleteAccount", 15, 1, 6.666666666666667, 593.7333333333335, 142, 1552, 502.0, 1274.2000000000003, 1552.0, 1552.0, 0.0827248461317862, 0.01669038399494827, 0.055839271138955676], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 144.66666666666666, 140, 152, 144.0, 152.0, 152.0, 152.0, 0.05575171901133618, 0.04388270070618844, 0.01981799386731091], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f9c601bc-68b1-468e-9ad5-29b7cb5f335b", 1, 0, 0.0, 658.0, 658, 658, 658.0, 658.0, 658.0, 658.0, 1.5197568389057752, 0.2745654445288754, 1.0478011018237081], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1138.3478260869565, 792, 1925, 1049.0, 1726.4000000000005, 1911.6, 1925.0, 0.09599131904592975, 0.049683006928069116, 0.04415225710022746], "isController": false}, {"data": ["goToProfile", 15, 1, 6.666666666666667, 287.3333333333333, 142, 949, 239.0, 569.8000000000002, 949.0, 949.0, 0.0813334345482741, 0.1670088883888389, 0.05212011694392331], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8df0af01-5ec4-4443-82f7-3db7c3e68789", 3, 0, 0.0, 383.66666666666663, 236, 675, 240.0, 675.0, 675.0, 675.0, 0.08579027138322515, 0.05336758092882267, 0.055015245646143726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 9, 100.0, 172.77777777777777, 137, 410, 145.0, 410.0, 410.0, 410.0, 0.05573169523432082, 0.027702571166278608, 0.027974698584414943], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/966239ea-04ec-40fb-909b-a3bfec535375", 1, 0, 0.0, 941.0, 941, 941, 941.0, 941.0, 941.0, 941.0, 1.0626992561105206, 0.33935806323060574, 0.634091060042508], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6491cd28-55b0-4ee8-a026-7706d9483bae", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3384b11c-be58-4adb-878e-c8cfafa0c715", 1, 0, 0.0, 987.0, 987, 987, 987.0, 987.0, 987.0, 987.0, 1.0131712259371835, 0.18304362968591692, 0.6985340678824722], "isController": false}, {"data": ["addBook", 61, 61, 100.0, 827.1311475409833, 586, 1158, 749.0, 1032.4, 1095.8, 1158.0, 0.2696978941457872, 0.8865739704503954, 0.5271811471776778], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dffea2c7-755c-46c3-9455-cebb7c8e1a1c", 1, 0, 0.0, 721.0, 721, 721, 721.0, 721.0, 721.0, 721.0, 1.3869625520110958, 0.2505742891816921, 0.956245665742025], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6491cd28-55b0-4ee8-a026-7706d9483bae", 3, 0, 0.0, 563.6666666666666, 255, 934, 502.0, 934.0, 934.0, 934.0, 0.03557959154628905, 0.03568382863089732, 0.02281633963092104], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 193.31578947368422, 140, 448, 151.0, 431.0, 448.0, 448.0, 0.08580202312138728, 0.06410014422642703, 0.030499937906430637], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7f657188-41f9-4cbf-ab1d-a9e2d842b34e", 3, 0, 0.0, 667.6666666666666, 278, 1324, 401.0, 1324.0, 1324.0, 1324.0, 0.020810355232763825, 0.0245971353678924, 0.013345182229343989], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5a413032-13eb-4810-8aea-b475bcfbb7de", 1, 0, 0.0, 1407.0, 1407, 1407, 1407.0, 1407.0, 1407.0, 1407.0, 0.7107320540156361, 0.2269622867803838, 0.42407937988628286], "isController": false}, {"data": ["deleteBooks", 15, 1, 6.666666666666667, 549.7999999999998, 147, 987, 537.0, 844.2, 987.0, 987.0, 0.08253412786187088, 0.015539628761492877, 0.05651116033354792], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 7, 3.8461538461538463, 222.6538461538462, 139, 572, 156.5, 431.80000000000007, 456.3499999999999, 565.3599999999999, 0.7316171150166423, 1.6126055342613883, 0.3505652257259893], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 148.64285714285714, 140, 159, 148.0, 159.0, 159.0, 159.0, 0.07140015708034557, 0.055293285707728554, 0.02538052458715409], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dffea2c7-755c-46c3-9455-cebb7c8e1a1c", 3, 0, 0.0, 665.6666666666666, 304, 949, 744.0, 949.0, 949.0, 949.0, 0.0541936882417761, 0.03484131975179291, 0.03475311387900356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 14, 100.0, 146.07142857142858, 139, 162, 144.0, 159.0, 162.0, 162.0, 0.0940057880706655, 0.04672748645309447, 0.04718649909015827], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7f657188-41f9-4cbf-ab1d-a9e2d842b34e", 1, 0, 0.0, 514.0, 514, 514, 514.0, 514.0, 514.0, 514.0, 1.9455252918287937, 0.3514865029182879, 1.3413484922178989], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 12, 0, 0.0, 147.24999999999997, 141, 154, 147.0, 153.1, 154.0, 154.0, 0.07548594074353651, 0.06125861011511606, 0.026832892998678998], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 569.2608695652174, 196, 1337, 522.0, 1107.4000000000003, 1310.1999999999996, 1337.0, 0.0930033198141551, 0.057128015784280825, 0.042051305736283025], "isController": false}, {"data": ["login", 23, 4, 17.391304347826086, 2134.347826086957, 1178, 3367, 2171.0, 2757.0, 3256.1999999999985, 3367.0, 0.09815134083266476, 0.14546835526091187, 0.14748955941783454], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 14, 100.0, 167.92857142857142, 141, 456, 144.5, 307.5, 456.0, 456.0, 0.07202312971365661, 0.03580055959399533, 0.03615223503205029], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 168.5625, 141, 428, 151.0, 246.7000000000002, 428.0, 428.0, 0.08512811781731505, 0.06891719694390057, 0.030260385630373712], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 20, 100.0, 187.65, 139, 447, 146.5, 413.9, 445.34999999999997, 447.0, 0.08610483263373156, 0.04280015606500915, 0.04322058981810354], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8df0af01-5ec4-4443-82f7-3db7c3e68789", 1, 0, 0.0, 684.0, 684, 684, 684.0, 684.0, 684.0, 684.0, 1.461988304093567, 0.2641287463450292, 1.0079724049707601], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3b1a68ed-877f-4bc7-a269-dcc3479a235e", 1, 0, 0.0, 314.0, 314, 314, 314.0, 314.0, 314.0, 314.0, 3.1847133757961785, 1.0169934315286624, 1.9002537818471337], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=192efa56-f485-4048-89b3-d756046b4211", 1, 0, 0.0, 609.0, 609, 609, 609.0, 609.0, 609.0, 609.0, 1.6420361247947455, 0.29665691707717573, 1.1321069376026274], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=de09ab62-a595-4ac3-80f1-2c2d14af7f52", 1, 0, 0.0, 678.0, 678, 678, 678.0, 678.0, 678.0, 678.0, 1.4749262536873156, 0.26646616887905605, 1.0168925147492625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 149.78571428571425, 140, 164, 147.0, 163.5, 164.0, 164.0, 0.09730939522210869, 0.08067937162458035, 0.03459044908285895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 17, 100.0, 162.47058823529412, 139, 425, 147.0, 207.3999999999998, 425.0, 425.0, 0.07689489372673364, 0.03822216885440178, 0.03859763220267685], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 150.88235294117646, 146, 158, 151.0, 158.0, 158.0, 158.0, 0.07793410442253121, 0.06050548146085186, 0.027703138681446637], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a3861b4d-37b3-43b6-8e01-b891d50c796e", 1, 0, 0.0, 299.0, 299, 299, 299.0, 299.0, 299.0, 299.0, 3.3444816053511706, 1.068013168896321, 1.9955842391304348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 12, 12, 100.0, 171.41666666666666, 140, 446, 145.5, 359.9000000000003, 446.0, 446.0, 0.07674548001100018, 0.038147899732030366, 0.03852263352114658], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 6, 100.0, 196.66666666666666, 137, 465, 142.0, 465.0, 465.0, 465.0, 0.057631351455191625, 0.02864683387762943, 0.03268965817404668], "isController": false}, {"data": ["register", 24, 4, 16.666666666666668, 948.4583333333333, 201, 1846, 970.0, 1496.5, 1774.0, 1846.0, 0.09491418176065808, 0.0302168195839595, 0.0428226093490469], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 2.0, 0.6279434850863422], "isController": false}, {"data": ["401/Unauthorized", 9, 4.5, 1.41287284144427], "isController": false}, {"data": ["404/Not Found", 187, 93.5, 29.356357927786497], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 637, 200, "404/Not Found", 187, "401/Unauthorized", 9, "406/Not Acceptable", 4, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 19, "404/Not Found", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 60, 60, "404/Not Found", 60, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 9, "404/Not Found", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 14, "404/Not Found", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 14, "404/Not Found", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 20, "404/Not Found", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 12, 12, "404/Not Found", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 6, "404/Not Found", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
