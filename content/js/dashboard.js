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

    var data = {"OkPercent": 96.2757527733756, "KoPercent": 3.7242472266244055};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6912660798916723, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ed3d937b-25ee-4726-ae8d-fa197b9da473"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/02f5bdae-2a86-4d6e-b9b3-bf4c563f6dba"], "isController": false}, {"data": [0.34375, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.34375, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/965c9e08-e216-41b5-8e06-3deff8309198"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/5b7d44c5-1570-417c-8c0e-db2d273c2f2c"], "isController": false}, {"data": [0.59375, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3b99a7e6-9c17-4f0d-bd63-8327adc96136"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/e8242ad5-4849-43fe-b6c8-e08245a8ece6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e5598220-d761-4de1-945c-6af53408f8b8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5555555555555556, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/732ce73b-8921-495e-84e1-6a81d7ffb73b"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/3b99a7e6-9c17-4f0d-bd63-8327adc96136"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/85a365e6-b6ae-4cc0-b023-02b440855d98"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5e4fb761-c91b-4d98-98bf-355be199e122"], "isController": false}, {"data": [0.3888888888888889, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5874e88d-072e-46df-bd84-8b8a9b922cc3"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.13333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=686e6cd1-a08e-4601-96b8-668677de9405"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=732ce73b-8921-495e-84e1-6a81d7ffb73b"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2692307692307692, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ed3d937b-25ee-4726-ae8d-fa197b9da473"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=965c9e08-e216-41b5-8e06-3deff8309198"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.11403508771929824, 500, 1500, "addBook"], "isController": true}, {"data": [0.9038461538461539, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9807692307692307, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4230769230769231, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.8809523809523809, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.7620481927710844, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e5598220-d761-4de1-945c-6af53408f8b8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e8242ad5-4849-43fe-b6c8-e08245a8ece6"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=85a365e6-b6ae-4cc0-b023-02b440855d98"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=02f5bdae-2a86-4d6e-b9b3-bf4c563f6dba"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5e4fb761-c91b-4d98-98bf-355be199e122"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/25e66688-cc74-4378-9e93-f9a8064bd5a7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5874e88d-072e-46df-bd84-8b8a9b922cc3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/686e6cd1-a08e-4601-96b8-668677de9405"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/08642721-6cdc-4c4c-b5d1-8da9684a878f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1262, 47, 3.7242472266244055, 508.469889064976, 125, 10454, 158.0, 1343.7000000000005, 1649.85, 2299.289999999998, 4.996377428409671, 694.7277254840488, 3.652411719612959], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ed3d937b-25ee-4726-ae8d-fa197b9da473", 1, 0, 0.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 248.0, 4.032258064516129, 0.728484122983871, 2.780052923387097], "isController": false}, {"data": ["see books", 52, 0, 0.0, 2432.576923076924, 1603, 4723, 2217.5, 3372.9000000000005, 4343.749999999997, 4723.0, 0.22840878143915103, 274.8517702160989, 1.1230841938927005], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/02f5bdae-2a86-4d6e-b9b3-bf4c563f6dba", 3, 0, 0.0, 489.0, 240, 725, 502.0, 725.0, 725.0, 725.0, 0.019860315779020886, 0.023474220896362252, 0.012735944689020555], "isController": false}, {"data": ["deleteBook", 16, 4, 25.0, 1096.75, 133, 4835, 551.0, 4830.1, 4835.0, 4835.0, 0.0824270649267687, 0.017246092441953315, 0.0550385797301544], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, 25.0, 1096.75, 133, 4835, 551.0, 4830.1, 4835.0, 4835.0, 0.08220726506705031, 0.01720010404356985, 0.05489181395468325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 130.8235294117647, 126, 136, 131.0, 134.4, 136.0, 136.0, 0.10020926051460403, 0.02681380603613428, 0.057150593887235104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 132.23529411764707, 127, 137, 133.0, 137.0, 137.0, 137.0, 0.10020926051460403, 0.07447192114415396, 0.050300351469244595], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/965c9e08-e216-41b5-8e06-3deff8309198", 3, 0, 0.0, 339.0, 247, 487, 283.0, 487.0, 487.0, 487.0, 0.06669037880135159, 0.030175659678996977, 0.04276694213498133], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 161.94117647058823, 126, 392, 132.0, 389.6, 392.0, 392.0, 0.10021162336935058, 0.02701016411127027, 0.05901133680831875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 176.47058823529412, 127, 390, 132.0, 389.2, 390.0, 390.0, 0.10021103264521758, 0.0270100048926563, 0.058913126613692364], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5b7d44c5-1570-417c-8c0e-db2d273c2f2c", 2, 0, 0.0, 738.0, 360, 1116, 738.0, 1116.0, 1116.0, 1116.0, 0.017482211849443194, 0.029876826891138266, 0.010866628752119719], "isController": false}, {"data": ["goToProfile", 16, 4, 25.0, 407.625, 132, 1931, 251.0, 1113.4000000000008, 1931.0, 1931.0, 0.08305992773786287, 0.11681823210837244, 0.05367666716848706], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3b99a7e6-9c17-4f0d-bd63-8327adc96136", 1, 0, 0.0, 1485.0, 1485, 1485, 1485.0, 1485.0, 1485.0, 1485.0, 0.6734006734006734, 0.12165930134680134, 0.46427819865319864], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e8242ad5-4849-43fe-b6c8-e08245a8ece6", 3, 0, 0.0, 1551.6666666666667, 657, 2592, 1406.0, 2592.0, 2592.0, 2592.0, 0.06986330080808552, 0.032384550895414636, 0.04480166099997671], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 183.1764705882353, 128, 416, 133.0, 400.0, 416.0, 416.0, 0.09455107704800414, 0.07026696253274527, 0.04746020859636145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 202.4705882352941, 126, 527, 133.0, 421.3999999999999, 527.0, 527.0, 0.09441349779794402, 0.04194588648720697, 0.05291234400946357], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 908.75, 662, 1053, 1004.5, 1053.0, 1053.0, 1053.0, 0.05589402492873512, 16.434699185344588, 0.03187706109216925], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1278.0, 904, 1441, 1325.0, 1441.0, 1441.0, 1441.0, 0.055599958300031276, 50.028940212669845, 0.03165505438370921], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 295.875, 130, 398, 390.5, 398.0, 398.0, 398.0, 0.05600044800358403, 0.09909454275634205, 0.03100806056448452], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 154.83333333333334, 128, 391, 133.5, 315.10000000000025, 391.0, 391.0, 0.05416629051187145, 0.04025444050735759, 0.02718893879209172], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 193.66666666666669, 127, 391, 131.5, 388.6, 391.0, 391.0, 0.05416751303405782, 0.021273797029814703, 0.03051330771661363], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 249.99999999999994, 128, 1301, 133.0, 1022.900000000001, 1301.0, 1301.0, 0.054167268525205835, 4.075033410201954, 0.03145651271125235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 261.5833333333333, 126, 1178, 132.5, 943.1000000000008, 1178.0, 1178.0, 0.054166046014056085, 1.3406008227596697, 0.03150869929268171], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e5598220-d761-4de1-945c-6af53408f8b8", 3, 0, 0.0, 398.0, 231, 569, 394.0, 569.0, 569.0, 569.0, 0.021171339651802033, 0.029186400854616414, 0.013576672888688154], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 166.0, 127, 398, 132.0, 398.0, 398.0, 398.0, 0.05599731212901781, 0.04161518997088139, 0.031443803197446524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 1143.6666666666667, 131, 5687, 1285.5, 2053.7000000000057, 5687.0, 5687.0, 0.08337502084375521, 41.68831558429678, 0.045034814861134274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 339.47058823529414, 128, 1283, 134.0, 1198.1999999999998, 1283.0, 1283.0, 0.09441297345329334, 10.016919273436631, 0.05454995904143063], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/732ce73b-8921-495e-84e1-6a81d7ffb73b", 3, 0, 0.0, 463.3333333333333, 397, 510, 483.0, 510.0, 510.0, 510.0, 0.06850253459377997, 0.030995612983513724, 0.04392903422843312], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 635.7777777777778, 127, 1078, 772.0, 1058.2, 1078.0, 1078.0, 0.08327203586249012, 13.612610537844828, 0.045060508121336613], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 360.4705882352941, 128, 1075, 381.0, 1051.8, 1075.0, 1075.0, 0.09453582907922102, 3.292679451247317, 0.05471326275121507], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 507.6428571428571, 140, 1485, 486.0, 1384.0, 1485.0, 1485.0, 0.0814133355043556, 0.016701773138833, 0.054886989930914974], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 449.08333333333337, 261, 1435, 271.0, 1236.1000000000008, 1435.0, 1435.0, 0.054132814861262105, 5.473709531491766, 0.12059177034604403], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 916.8181818181818, 157, 3264, 614.0, 1982.3999999999999, 3077.699999999997, 3264.0, 0.10616325979114791, 0.06521161172717972, 0.04800155203447411], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 159.88888888888889, 127, 387, 132.0, 381.6, 387.0, 387.0, 0.08337656562662121, 0.06196246722837768, 0.041851127668050096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 217.1111111111111, 127, 397, 133.0, 393.4, 397.0, 397.0, 0.08327434733730275, 0.09176804161866826, 0.04360698787432976], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3b99a7e6-9c17-4f0d-bd63-8327adc96136", 3, 0, 0.0, 1291.0, 238, 1931, 1704.0, 1931.0, 1931.0, 1931.0, 0.04165393907417178, 0.026779469294104578, 0.026711673169309377], "isController": false}, {"data": ["login", 22, 0, 0.0, 3895.7272727272725, 1889, 12172, 3033.0, 6644.2, 11355.249999999989, 12172.0, 0.10489677204024223, 45.773863270633676, 0.22151806787297956], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/85a365e6-b6ae-4cc0-b023-02b440855d98", 3, 0, 0.0, 752.3333333333334, 240, 1254, 763.0, 1254.0, 1254.0, 1254.0, 0.07586869657579283, 0.034328609453239595, 0.04865277742653381], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 380.7058823529411, 131, 2033, 146.0, 1220.9999999999993, 2033.0, 2033.0, 0.09059950223567596, 0.07334666733728062, 0.03220529181033793], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5e4fb761-c91b-4d98-98bf-355be199e122", 3, 0, 0.0, 356.3333333333333, 224, 492, 353.0, 492.0, 492.0, 492.0, 0.05741956475969912, 0.03691524752617375, 0.03682179120332268], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 1320.6666666666667, 264, 5824, 1415.5, 2187.100000000006, 5824.0, 5824.0, 0.08322275495059804, 55.3702950246663, 0.17534030304641518], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5874e88d-072e-46df-bd84-8b8a9b922cc3", 1, 0, 0.0, 535.0, 535, 535, 535.0, 535.0, 535.0, 535.0, 1.8691588785046729, 0.3376898364485981, 1.288697429906542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 311.70588235294116, 260, 522, 267.0, 521.2, 522.0, 522.0, 0.10013016921998598, 0.1551822056173025, 0.22519509737658958], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 7, 46.666666666666664, 833.4666666666667, 132, 1702, 1037.0, 1625.8, 1702.0, 1702.0, 0.09161592162563291, 58.46716972078521, 0.1384020732683064], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=686e6cd1-a08e-4601-96b8-668677de9405", 1, 0, 0.0, 1283.0, 1283, 1283, 1283.0, 1283.0, 1283.0, 1283.0, 0.779423226812159, 0.14081376656274358, 0.5373757794232269], "isController": false}, {"data": ["register", 24, 9, 37.5, 1302.3333333333335, 200, 2310, 1269.0, 2214.0, 2302.25, 2310.0, 0.09877762686751451, 0.030723314606741572, 0.0445656871218669], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 139.93333333333334, 130, 158, 137.0, 157.4, 158.0, 158.0, 0.0714455822814956, 0.05546800577518457, 0.02539667182662539], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 579.5882352941178, 266, 1414, 525.0, 1330.8, 1414.0, 1414.0, 0.0943443346227059, 13.407675093719996, 0.20934275123341342], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 0, 0.0, 372.047619047619, 260, 922, 269.0, 738.8000000000002, 908.5999999999998, 922.0, 0.10763048915494691, 0.16680623661025462, 0.24206349269906516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 132.5, 128, 135, 133.0, 135.0, 135.0, 135.0, 0.03162505336727756, 0.023502603137205293, 0.01587429436599674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 130.66666666666669, 127, 135, 130.5, 135.0, 135.0, 135.0, 0.031625220058822914, 0.008462217086052224, 0.01803625831479744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 131.0, 129, 133, 131.0, 133.0, 133.0, 133.0, 0.031624553303184595, 0.008523805382498972, 0.018591778406755004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 176.83333333333331, 131, 393, 133.5, 393.0, 393.0, 393.0, 0.03158094195422868, 0.008512050761100702, 0.018596980467187402], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=732ce73b-8921-495e-84e1-6a81d7ffb73b", 1, 0, 0.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 248.0, 4.032258064516129, 0.728484122983871, 2.780052923387097], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 264.0, 140, 511, 141.0, 511.0, 511.0, 511.0, 0.030710015559741215, 0.009057055370158053, 0.018983827977847843], "isController": false}, {"data": ["https://demoqa.com/books", 52, 0, 0.0, 1503.211538461539, 1018, 2523, 1429.0, 2010.6000000000001, 2175.2499999999995, 2523.0, 0.23238561711788208, 278.0139883851881, 0.45887081817613046], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ed3d937b-25ee-4726-ae8d-fa197b9da473", 3, 0, 0.0, 358.0, 237, 580, 257.0, 580.0, 580.0, 580.0, 0.08348639171814995, 0.037775418127678526, 0.05353782281404798], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, 37.5, 1302.3333333333335, 200, 2310, 1269.0, 2214.0, 2302.25, 2310.0, 0.09652742585487101, 0.030023422983180097, 0.043550459711865636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 3, 0, 0.0, 218.66666666666666, 130, 394, 132.0, 394.0, 394.0, 394.0, 0.014106560961503195, 0.0038021590091551582, 0.008306890878697681], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 3, 0, 0.0, 220.33333333333334, 133, 391, 137.0, 391.0, 391.0, 391.0, 0.01410609665497428, 0.003802033864036036, 0.008292841978803239], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 166.33333333333334, 127, 406, 131.0, 397.0, 406.0, 406.0, 0.07191140514885662, 0.019382370919027756, 0.042276040917589526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 219.8, 126, 394, 136.0, 394.0, 394.0, 394.0, 0.0719148528142679, 0.019383300172595645, 0.0423482971162144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 3, 0, 0.0, 130.0, 127, 133, 130.0, 133.0, 133.0, 133.0, 0.014106494630127711, 0.003774589383452141, 0.00804511021874471], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 149.66666666666666, 127, 379, 132.0, 236.80000000000007, 379.0, 379.0, 0.07190899197975044, 0.05344017860995124, 0.03609494323983566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 3, 0, 0.0, 219.66666666666666, 135, 381, 143.0, 381.0, 381.0, 381.0, 0.01410609665497428, 0.010483144096128346, 0.0070805992975163864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 216.13333333333333, 127, 396, 131.0, 393.0, 396.0, 396.0, 0.07191416325473915, 0.019242656964646998, 0.04101354623121842], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 3, 0, 0.0, 143.0, 135, 154, 140.0, 154.0, 154.0, 154.0, 0.013990905911157748, 0.01101237320741518, 0.004973329835606856], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 700.4285714285714, 133, 1704, 497.0, 1588.5, 1704.0, 1704.0, 0.08255641846669143, 0.016452545170154678, 0.056175911142757745], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=965c9e08-e216-41b5-8e06-3deff8309198", 1, 0, 0.0, 279.0, 279, 279, 279.0, 279.0, 279.0, 279.0, 3.5842293906810037, 0.6475414426523297, 2.4711581541218637], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 2051.681818181818, 917, 10454, 1695.0, 2783.2, 9306.349999999984, 10454.0, 0.10265503242965797, 0.05313199920675657, 0.04721730495543838], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 3, 0, 0.0, 442.0, 270, 776, 280.0, 776.0, 776.0, 776.0, 0.0140970156617844, 0.021847620952394377, 0.03170451862215769], "isController": false}, {"data": ["addBook", 57, 24, 42.10526315789474, 1680.017543859649, 667, 6416, 1028.0, 3034.0, 3707.6999999999834, 6416.0, 0.26312023671589013, 72.85115858735593, 0.9557357542895523], "isController": true}, {"data": ["https://demoqa.com/books-0", 52, 0, 0.0, 247.51923076923075, 129, 773, 137.0, 527.7, 601.299999999999, 773.0, 0.2338182063445671, 0.17376528811349176, 0.11302735560601632], "isController": false}, {"data": ["https://demoqa.com/books-3", 52, 0, 0.0, 829.4615384615387, 636, 1294, 770.0, 1070.3, 1179.1999999999998, 1294.0, 0.23399812801497588, 68.80321910549716, 0.11768460539815682], "isController": false}, {"data": ["https://demoqa.com/books-1", 52, 0, 0.0, 200.07692307692307, 127, 521, 136.0, 397.7, 445.4999999999994, 521.0, 0.23452263368917634, 0.4149951291453003, 0.11405495271211895], "isController": false}, {"data": ["https://demoqa.com/books-2", 52, 0, 0.0, 1253.9999999999998, 880, 1716, 1272.5, 1564.4, 1614.8, 1716.0, 0.23322673675429115, 209.85782770038438, 0.1170688893473688], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 371.33333333333326, 133, 2055, 143.0, 1074.6000000000001, 1962.0999999999985, 2055.0, 0.10531383522898237, 0.07867683979508937, 0.03743577736655233], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 24, 14.457831325301205, 334.2349397590362, 129, 4750, 139.5, 754.4000000000004, 1450.150000000001, 3103.810000000031, 0.6763005544849727, 1.4582014555739795, 0.3238193131678977], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 182.16666666666666, 135, 388, 142.0, 388.0, 388.0, 388.0, 0.03174116140909596, 0.024580801755286225, 0.01128299096963958], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e5598220-d761-4de1-945c-6af53408f8b8", 1, 0, 0.0, 506.0, 506, 506, 506.0, 506.0, 506.0, 506.0, 1.976284584980237, 0.35704360177865613, 1.3625555830039526], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 138.88235294117646, 133, 158, 136.0, 154.8, 158.0, 158.0, 0.09309967141292443, 0.07555256537513691, 0.03309402382256298], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e8242ad5-4849-43fe-b6c8-e08245a8ece6", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 311.0, 262, 529, 270.0, 529.0, 529.0, 529.0, 0.03155951335230411, 0.04891108172861975, 0.07097808520542613], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=85a365e6-b6ae-4cc0-b023-02b440855d98", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 0.7404264856557378, 2.82562756147541], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 406.46666666666675, 263, 773, 286.0, 634.4000000000001, 773.0, 773.0, 0.07186213967125467, 0.11137228091629019, 0.1616196363895503], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=02f5bdae-2a86-4d6e-b9b3-bf4c563f6dba", 1, 0, 0.0, 499.0, 499, 499, 499.0, 499.0, 499.0, 499.0, 2.004008016032064, 0.36205222945891785, 1.3816695891783568], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5e4fb761-c91b-4d98-98bf-355be199e122", 1, 0, 0.0, 515.0, 515, 515, 515.0, 515.0, 515.0, 515.0, 1.941747572815534, 0.3508040048543689, 1.338743932038835], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 333.75000000000006, 128, 2109, 138.5, 1631.1000000000017, 2109.0, 2109.0, 0.05525726863321146, 0.04581388776327786, 0.019642232209461888], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/25e66688-cc74-4378-9e93-f9a8064bd5a7", 1, 0, 0.0, 299.0, 299, 299, 299.0, 299.0, 299.0, 299.0, 3.3444816053511706, 1.068013168896321, 1.9955842391304348], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 162.94444444444443, 133, 463, 142.0, 243.40000000000035, 463.0, 463.0, 0.07949230911909273, 0.061715220458670624, 0.028257031757177493], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5874e88d-072e-46df-bd84-8b8a9b922cc3", 3, 0, 0.0, 676.6666666666666, 286, 1293, 451.0, 1293.0, 1293.0, 1293.0, 0.019587103850824617, 0.02315129364659641, 0.012560740425170734], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/686e6cd1-a08e-4601-96b8-668677de9405", 3, 0, 0.0, 718.6666666666667, 245, 1473, 438.0, 1473.0, 1473.0, 1473.0, 0.04583861750729598, 0.029469814315400248, 0.029395207190551133], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/08642721-6cdc-4c4c-b5d1-8da9684a878f", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 1.1915520055970148, 2.226416744402985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 21, 0, 0.0, 156.52380952380952, 128, 388, 133.0, 335.8000000000002, 387.6, 388.0, 0.10770280181145855, 0.0800408517368359, 0.054061757940517284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 21, 0, 0.0, 143.71428571428572, 125, 397, 131.0, 143.0, 371.7999999999996, 397.0, 0.10770722099983074, 0.028820096244095334, 0.06142677447646597], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 21, 0, 0.0, 180.19047619047618, 126, 403, 131.0, 393.8, 402.3, 403.0, 0.10770722099983074, 0.02903046191011063, 0.06332006547060362], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 21, 0, 0.0, 176.57142857142858, 128, 533, 133.0, 401.2, 520.1999999999998, 533.0, 0.10770611616873958, 0.02903016412360559, 0.06342459770483395], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 19.148936170212767, 0.7131537242472267], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 8.51063829787234, 0.31695721077654515], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 6.382978723404255, 0.23771790808240886], "isController": false}, {"data": ["401/Unauthorized", 31, 65.95744680851064, 2.456418383518225], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1262, 47, "401/Unauthorized", 31, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 24, "401/Unauthorized", 24, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
